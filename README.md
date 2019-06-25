# redis-session-demo
Demo app that shows session management for a Node.js app using express-sessions and connect-redis.

The app queries an API for ML-generated craft beer names and displays them on the page. There is a session management panel that displays session ID, time until the session expires, and the number of beer names viewed in that session. 

# branches
The *master* branch contains the app with simple session management.

The *auth* branch will add in authentication using passport.js.
