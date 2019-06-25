const createError = require('http-errors');
const express = require('express');
const path = require('path');
const uuid = require('uuid/v4')
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const bodyParser = require('body-parser');
const indexRouter = require('./routes/index');

const redisClient = redis.createClient();

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
  secret: 'you should use a better secret',
  resave: false,
  cookie: { secure: false, maxAge: 60000 }, // Set to expire in 1 minute for demo purposes
  saveUninitialized: true
}))

app.use('/', indexRouter);

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
