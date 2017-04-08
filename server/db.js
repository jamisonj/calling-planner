const MongoClient = require('mongodb').MongoClient;

module.exports = function(dbName) {
	// Connection URL
	const url = 'mongodb://localhost:27017/' + dbName;
	return MongoClient.connect(url);

	// Use connect method to connect to the server
	MongoClient.connect(url)
		.then(function(err, db) {
			if (err) console.error(err.stack);
	  		console.log("Connected successfully to server");

	  		// db.close();
	});
}

