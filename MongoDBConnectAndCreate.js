
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

/*************************************************************************
 * 
 * 
 * =================
 * To Do List:
 * =================
 * 
 * Decrypt the Client Requests after moving to HTTPS mode
 * Check for Uniqueness of UserName before Registration
 * 
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables
 * 
 *************************************************************************/

// Generic Variables Global

var mongoClient = require('mongodb').MongoClient;

var databaseURL = "mongodb://127.0.0.1:27017";

console.log("Inside handleMongoDBCollectionRequests. Connecting to and creating database and tables");

mongoClient.connect(databaseURL, function(error, database) {

    if(error) {
        console.log("Errror while creating the database");
    }
        
    console.log("Database Created successfully");

    var dbObject = database.db("userCollectionDB");

    dbObject.createCollection("New_Users", function (error, result) {

        if (error) {

            console.log("Some error while creating users table : error = " + error);
        }

        console.log("Successfully created the collection " + error);
    }

    );

    database.close();

}).catch(err => { console.log("Error while connecting to mongoDB => " + err)});


