'use strict';

// include modules
const MongoClient         = require('mongodb').MongoClient;
const assert              = require('assert');
const bodyParser          = require('body-parser');
const cookieParser        = require('cookie-parser');
const express             = require('express');
const LocalStrategy       = require('passport-local').Strategy;
const passport            = require('passport');
const session             = require('express-session');

const app = express();
var data = {};


var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}

var updateDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });  
}

var removeDocument = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Delete document where a is 3
  collection.deleteOne({ a : 3 }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Removed the document with the field a equal to 3");
    callback(result);
  });    
}


// Connection URL
var url = 'mongodb://localhost:27017/myproject';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  removeDocument(db, function() {
    findDocuments(db, function() {
        db.close();
    });
  });
});

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

// app.get('/', function(req, res) {
// 	console.log(req.path);
// 	res.sendFile('www/index.html', {root: '.'}); // Send the index file if no subdirectory specified.
// });

app.listen(3000, function () {
  console.log('Calling Planner listening on port 3000!')
})