'use strict';

// include modules
const bodyParser          = require('body-parser');
const cookieParser        = require('cookie-parser');
const express             = require('express');
const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const session             = require('express-session');
const mongoose            = require('mongoose');

const app = express();
var data = {};

// login --------------------------------------------------------------------------------

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
  process.nextTick(function() {
    UserDetails.findOne({
      'username': username, 
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false);
      }

      if (user.password != password) {
        return done(null, false);
      }

      return done(null, user);
    });
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('www'));

//mongoose user model ---------------------------------------------------------------

mongoose.connect('mongodb://localhost/MyDatabase');

var Schema = mongoose.Schema;
var UserDetail = new Schema({
      username: String,
      password: String
    }, {
      collection: 'userInfo'
    });
var UserDetails = mongoose.model('userInfo', UserDetail);

//routes -------------------------------------------------------------------------

app.use('/api', bodyParser.json());
// app.use('/api/tasks', taskRoute);
// app.use('/api/people', peopleRoutes);

// Our API can only be hit if the user is authenticated.
app.get('/api/*', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.send(data[req.user.username]);
});

// This page can only be hit if the user is authenticated.
app.get('/brainstorm', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

// This page can only be hit if the user is authenticated.
app.get('/staging', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

// This page can only be hit if the user is authenticated.
app.get('/final', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

app.get('/login', function(req, res) {
    res.sendFile('www/index.html', {root: '.'});
});

app.post('/api/register', passport.authenticate('local'), function(req, res) {
    if (data[req.user.username]) {
        res.sendStatus(401).send('This username is already registered.');
    }

    else {
        data[req.user.username] = req.user;
    }

    res.send(data[req.user.username]);
});

// Login URL.
app.post('/api/login', function(req, res, next ){
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }
      if (!user) { return res.json( { message: "Incorrect credentials" }) }
      res.json(user);
    })(req, res, next);   
});

// Logout URL.
app.delete('/api/logout', function(req, res) {
    // if (!req.user) return res.sendStatus(401);
    req.logout();
    res.status(200).send("User has logged out."); 
});

// app.get('/', function(req, res) {
// 	console.log(req.path);
// 	res.sendFile('www/index.html', {root: '.'}); // Send the index file if no subdirectory specified.
// });

app.listen(3000, function () {
  console.log('Calling Planner listening on port 3000!')
})