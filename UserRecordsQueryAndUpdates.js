
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * Copy Rights Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');
var RecordHelperUtilsModule = require('./RecordHelperUtils');
var MongoDbCrudModule = require('./MongoDbCRUD')
var cryptoModule = require('crypto');
var QueryBuilderModule = require('./QueryBuilder');
var MySqlDbCrudModule = require('./MySqlDbCRUD');
var InventoryRecordsQueryAndUpdateModule = require('./InventoryRecordsQueryAndUpdates');


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * User Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {String} userId  : UserId of the record to be retrieved
 *
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordsFromUserDetailsDatabase = function (dbConnection, collectionName, userId, http_response) {

    // Retrieve User Records with current User Id

    console.log("retrieveRecordFromInventoryDetailsDatabase => collectionName :" + collectionName);

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, userId);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("retrieveRecordsFromUserDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "retrieveRecordsFromUserDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordsFromUserDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("retrieveRecordsFromUserDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully retrieved the records from the Collection : " + collectionName;
            //HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);

            InventoryRecordsQueryAndUpdateModule.handleQueryResults(result, http_response);
        }
    });
}



/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to User database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addUserRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection, http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addUserRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addUserRecordToDatabase : All <K,V> pairs are present, Adding User Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Inventory Object and add to the Inventory Details Database

    var userRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.userRegistrationDataRequiredFields,
        GlobalsForServiceModule.userRegistrationRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.userRegistrationDataRequiredFields,
        GlobalsForServiceModule.userRegistratonRecordDBColumns);

    // Remove spaces from user_object values before adding to DB

    userRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(userRecordObject);

    checkUniquenessAndAddUserRecord(dbConnection,
        collectionName,
        userRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "UserRegistration",
        http_response);

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {Object} document_TypesObject : Record Types object of added record to the table
 * @param {Object} document_ColumnsObject : DB Column names of the current record schema
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function checkUniquenessAndAddUserRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfUserRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.userRegistrationData_UniqueFields,
        document_Object);
    */

    console.log("checkUniquenessAndAddUserRecord => collectionName :" + collectionName);

    console.log("Adding New User record data => " + " User Id : " + document_Object.UserId);

    // Encrypt Password before Registering/Updating User registration record

    document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.userRegistrationDataRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

    /*
    // Register User Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("UserRecordsQueryAndUpdates.checkUniquenessOfUserRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "UserRecordsQueryAndUpdates.checkUniquenessOfUserRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfUserRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating User registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered User Data is unique, Adding New Record => " + " User_Id : " + document_Object.User_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("UserRecordsQueryAndUpdates.checkUniquenessOfUserRecord : " +
                    " User Record already exists with current unique field values : ");

                var failureMessage = "UserRecordsQueryAndUpdates.checkUniquenessOfUserRecord : " +
                    " User Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfUserRecord", failureMessage, http_response);

                return;
            }

        });
    } 
    */


}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be updated in User Details database
 * @param {Collection} updateRecordKeys : Required keys for record updation
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

exports.updateUserRecordInDatabase = function (dbConnection, collectionName, recordObjectMap, updateRecordKeys, http_response) {

    // Replace the "URL Space" with regular space in Query Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);
    console.log("UserRecordsQueryAndUpdates.updateUserRecordInDatabase : Update record based on input <k,v> pairs of Client Request : ");

    // Prepare the User Object and update it in the User Details Database

    var userRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, updateRecordKeys);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.userRegistrationDataRequiredFields,
        GlobalsForServiceModule.userRegistrationRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.userRegistrationDataRequiredFields,
        GlobalsForServiceModule.userRegistratonRecordDBColumns);

    // Remove spaces from user_object values before adding to DB

    userRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(userRecordObject);

    updateRecordInUserDetailsDatabase(dbConnection,
        collectionName,
        userRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "UpdateUserDetails",
        http_response);

    console.log("Web Service: Switch Statement : Successfully launched the update Record DB Request API : ");
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be updated ( Record, Row in Table )
 * @param {Object} recordTypesObject : Record types object of input record to be updated
 * @param {Object} recordDbColumnsObject : Db columns object of input record to be updated
 * @param {String} clientRequest : Client Request from Web client
 * @param {XMLHttpRequestResponse} http_response : Http response to be filled while responding to web client request
 *
 */

function updateRecordInUserDetailsDatabase(dbConnection, collectionName, document_Object, recordTypesObject,
    recordDbColumnsObject, clientRequest, http_response) {

    // Update if Present ; Return Error response otherwise

    console.log("UserRecordsQueryAndUpdates.updateRecordInUserDetailsDatabase => collectionName :" + collectionName +
        ", UserId :" + document_Object.UserId);

    if (!HelperUtilsModule.valueDefined(document_Object.UserId)) {

        console.error("UserRecordsQueryAndUpdates.updateRecordInUserDetailsDatabase : " +
            " UserId must be present in input request to update user details in database");

        var failureMessage = "UserRecordsQueryAndUpdates.updateRecordInUserDetailsDatabase : " +
            " UserId must be present in input request to update user details in database";
        HelperUtilsModule.logBadHttpRequestError("updateRecordInUserDetailsDatabase", failureMessage, http_response);

    }

    // Encrypt Password before Registering/Updating User registration record

    document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

    // Check for Record Presence

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, document_Object.UserId);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("updateRecordInUserDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "updateRecordInUserDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("updateRecordInUserDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("updateRecordInUserDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (result.length == 0) {

            console.error("updateRecordInUserDetailsDatabase : No record is found for the given UserId => " +
                document_Object.UserId);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "updateRecordInUserDetailsDatabase : No record is found for the given UserId => " +
                    document_Object.UserId;
                HelperUtilsModule.logBadHttpRequestError("updateRecordInUserDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

    });

    var updateRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordUpdates(collectionName, document_Object,
        recordTypesObject, recordDbColumnsObject, GlobalsForServiceModule.userRegistrationDataRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, updateRecordsToDBQuery,
        clientRequest, http_response);

}


/**
 * 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} inventoryName : Name of the inventory Record to be retrieved
 * 
 * @returns {String} recordRetrievalMySqlQuery : Query for Retrieval of Records from given collection
 *
 */

function getMySqlQueryForRecordRetrieval(collectionName, userId) {

    var recordRetrievalMySqlQuery = "SELECT * From " + collectionName + " WHERE UserId = '" + userId + "'";


    console.log("getMySqlQueryForRecordRetrieval : Retrieved the mysql query to retrieve records from the database => " +
        recordRetrievalMySqlQuery);

    return recordRetrievalMySqlQuery;

}

