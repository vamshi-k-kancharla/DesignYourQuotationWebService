

var mySqlConnection = require('mysql') ;

console.log("Trying out the connection creation and db creation code in mysql");

var mySqlClient = mySqlConnection.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Abcde_12345",
        database: "designyourrequotation"
    }
);

mySqlClient.connect(function (error) {

    if (error) {

        console.log("Error while connecting to MySql Database : " + error);
    }

    else {

        console.log("Successfully connected to mysql db ");
    }

    var createTableQuery = 'CREATE TABLE UserDetails (name VARCHAR(255), password VARCHAR(250), signupDate DATE)';
    mySqlClient.query(createTableQuery, function (Error, Result) {

        if (Error) {

            console.log("Error while creating Table : " + error);
        }

        else {

            console.log("Successfully created the Table");
        }

    });
       
});

