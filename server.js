'use strict';

var express = require('express')
const bodyParser = require('body-parser');

var instance = express()

instance.use(bodyParser());

instance.use(express.static('./www'));


instance.get('/', function (req, res) {
  res.send('Hello World!')
});

instance.post('/', function(req, res) {
	res.send(req.body);
});

instance.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})