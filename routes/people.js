'use strict';

var express = require('express');
const people = require('../controllers/people');
// const bodyParser = require('body-parser');

// Only will run when api/people is called.

const router = express.Router();

router.post('/', function(req, res){
	const person = people.addPerson(req.body);
	res.json(person); // Get the JSON representation of the person back.
});

router.get('/', function(req, res) {
	res.json(people.getPeople());
});

router.put('/:personId', function(req, res) {
	res.json(people.setPerson(req.params.personId, req.body));
});

module.exports = router;