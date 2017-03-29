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

// specify a URL that only authenticated users can hit
app.get('/api/protected', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.send(data[req.user.username]);
});

app.get('/brainstorm', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

app.get('/staging', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

app.get('/final', function(req, res) {
    if (!req.user) return res.sendStatus(401);
    res.sendFile('www/index.html', {root: '.'});
});

// specify the login url
app.post('/api/login', passport.authenticate('local'), function(req, res) {

    // If the user doesn't have an entry in data, add one.
    if (!data[req.user.username]) {
        console.log(req.user);
        data[req.user.username] = req.user;
    }

    res.send(data[req.user.username]);
});

// log the user out
app.delete('/api/logout', function(req, res) {
    // if (!req.user) return res.sendStatus(401);
    req.logout();
    res.status(200).send("User has logged out."); 
    res.redirect('/');
});

app.get('*', function(req, res) {
	console.log(req.path);
	// let fullPath = path.resolve(__dirname, 'www/index.html');
	// console.log(fullPath);
	res.sendFile('www/index.html', {root: '.'}); // Send the index file if not in api subdirectory.
});

app.listen(3000, function () {
  console.log('Calling Planner listening on port 3000!')
})