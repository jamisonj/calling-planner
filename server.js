'use strict';

var express = require('express')
const bodyParser = require('body-parser');
// const taskRoutes = require('.routes/tasks');
const peopleRoutes = require('./routes/people');

const app = express();

app.use(bodyParser());

app.use(express.static('./www'));
app.use(function(req, res, next) {

	if (req.path.indexOf('/api') !== 0) {
		res.sendFile('./www/index.html'); // Send the index file if not in api subdirectory.
	}

	else {
		next();
	}
});

app.use('/api', bodyParser.json());
// app.use('/api/tasks', taskRoute);
app.use('/api/people', peopleRoutes);


// app.get('/', function (req, res) {
//   res.send('Hello World!')
// });

// app.post('/', function(req, res) {
// 	res.send(req.body);
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})