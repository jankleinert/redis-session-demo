# redis-session-demo overview
Demo app that shows session management for a Node.js app using express-sessions and connect-redis.

The app queries an API for ML-generated craft beer names and displays them on the page. There is a session management panel that displays session ID, time until the session expires, and the number of beer names viewed in that session. 

# how to run
```
git clone https://github.com/jankleinert/redis-session-demo
cd redis-session-demo
npm install
npm run dev
```

Then in your browser, go to http://localhost:3000. It should look something like this:

<img>

# how it works
This demo uses [express-session](https://github.com/expressjs/session) for session management and [connect-redis](https://github.com/tj/connect-redis) as the session store.

# branches
The *master* branch contains the app with simple session management.

The *auth* branch will add in authentication using passport.js.
