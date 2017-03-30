'use strict';

// include modules
const bodyParser          = require('body-parser');
const cookieParser        = require('cookie-parser');
const express             = require('express');
const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const session             = require('express-session');

const app = express();
var data = {};

// tell passport to use a local strategy and tell it how to validate a username and password
passport.use(new LocalStrategy(function(username, password, done) {
    if (username && password) return done(null, { username: username });
    return done(null, false);
}));

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function(user, done) {
    done(null, user);
});

// tell passport how to go from the serialized data back to the user
passport.deserializeUser(function(user, done) {
    done(null, { username: user.username });
});

// tell the express app what middleware to use
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'secret key', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('www'));

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

// Login URL.
app.post('/api/login', passport.authenticate('local'), function(req, res) {

    // If the user doesn't have an entry in data, add one.
    if (!data[req.user.username]) {
        console.log(req.user);
        data[req.user.username] = req.user;
    }

    res.send(data[req.user.username]);
});

// Logout URL.
app.delete('/api/logout', function(req, res) {
    // if (!req.user) return res.sendStatus(401);
    req.logout();
    res.status(200).send("User has logged out."); 
});

app.get('/', function(req, res) {
	console.log(req.path);
	res.sendFile('www/index.html', {root: '.'}); // Send the index file if no subdirectory specified.
});

app.listen(3000, function () {
  console.log('Calling Planner listening on port 3000!')
})