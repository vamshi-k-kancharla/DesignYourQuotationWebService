

var MongoClient = require('mongodb').MongoClient;
var databaseURL = "mongodb://127.0.0.1:27017/";

console.log("What's the difference between typing vs cut paste for integration code");

MongoClient.connect(databaseURL, function (error, db) {

    if (error) console.log("Error while connecting to DB : " + Error);

    console.log("connection successful");

    db.close();
});