

const { MongoClient } = require('mongodb') ;
var databaseURL = 'mongodb://127.0.0.1:27017';

console.log("Trying out the connection creation and db creation code");

var client = new MongoClient(databaseURL);

async function main() {

    await client.connect();

    console.log("connection to server is successful");

    var databaseQuotation = client.db('DesignYourREQuotationDB');

    console.log("database is created successfully");

    var collection = databaseQuotation.collection('UserDetailsTable')

    console.log("UserDetails table is created Successfully");

}

main()


