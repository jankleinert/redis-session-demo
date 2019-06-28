const createError = require('http-errors');
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const mysql = require('mysql');
const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // demo purposes only
    database: 'redis_session_demo'
});
 

mysqlConnection.connect(function(err) {
  if (err) {
    console.log('error connecting to mysql: ' + err.stack);
    return;
  }
});


const redisClient = redis.createClient();

// configure passport.js to use the local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  (email, password, done) => {
    mysqlConnection.query('SELECT * FROM users WHERE email = ?', [email], function (error, results, fields) {
      if (error) throw error;
      var user = results[0];
      if (!user) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return done(null, false, { message: 'Invalid credentials.\n' });
      }
      return done(null, user);
    });
  }
));

// tell passport how to serialize the user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  mysqlConnection.query('SELECT * FROM users WHERE id = ?', [id], function (error, results, fields) {
    if (error) {
      done(error, false);
    }
    done(null, results[0]);  
  });
});

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  genid: (req) => {
    return uuid()
  },
  store: new redisStore({ host: 'localhost', port: 6379, client: redisClient }),
  name: '_redisDemo', 
  secret: process.env.SESSION_SECRET,
  resave: false,
  cookie: { secure: false, maxAge: 60000 }, // Set secure to false and to expire in 1 minute for demo purposes
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);

// error handling for 404
app.use(function(req, res, next) {
  next(createError(404));
});

// general error handling
app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
