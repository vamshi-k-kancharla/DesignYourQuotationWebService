
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
var QueryBuilderModule = require('./QueryBuilder');
var InventoryRecordsQueryAndUpdatesModule = require('./InventoryRecordsQueryAndUpdates');

var MySqlDbCrudModule = require('./MySqlDbCRUD');



/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * ExpenseAggregator Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to ExpenseAggregator database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addExpenseAggregatorRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection,
    http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addExpenseAggregatorRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addExpenseAggregatorRecordToDatabase : All <K,V> pairs are present, Adding ExpenseAggregator Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the ExpenseAggregator Object and add it to the ExpenseAggregator Details Database

    var expenseAggregatorRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.expenseAggregatorRecordRequiredFields,
        GlobalsForServiceModule.expenseAggregatorRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.expenseAggregatorRecordRequiredFields,
        GlobalsForServiceModule.expenseAggregatorRecordDBColumns);

    // Remove spaces from user_object values before adding to MongoDB

    expenseAggregatorRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(expenseAggregatorRecordObject);

    checkUniquenessAndAddExpenseAggregatorRecord(dbConnection,
        collectionName,
        expenseAggregatorRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "AddExpenseAggregatorRecord",
        http_response);

}



/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Object} document_Object : Document object to be added ( Record, Row in Table )
 * @param {Object} document_TypesObject : Record Types object of added record to the table
 * @param {Object} document_ColumnsObject : DB Column names of the current record schema
 * @param {String} clientRequest : Request from Web Client that's in process currently
 *
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

function checkUniquenessAndAddExpenseAggregatorRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfExpenseAggregatorRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.ExpenseAggregatorRecordData_UniqueFields,
        document_Object);
    */

    console.log("Adding New ExpenseAggregator record data => " + " Company Name & Project Name : " + document_Object.CompanyName + "&" + document_Object.ProjectName);

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.expenseAggregatorRecordRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

/*
    // Register ExpenseAggregator Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("ExpenseAggregatorRecordsQueryAndUpdates.checkUniquenessOfExpenseAggregatorRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "ExpenseAggregatorRecordsQueryAndUpdates.checkUniquenessOfExpenseAggregatorRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfExpenseAggregatorRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating ExpenseAggregator registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered ExpenseAggregator Data is unique, Adding New Record => " + " ExpenseAggregator_Id : " + document_Object.ExpenseAggregator_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("ExpenseAggregatorRecordsQueryAndUpdates.checkUniquenessOfExpenseAggregatorRecord : " +
                    " ExpenseAggregator Record already exists with current unique field values : ");

                var failureMessage = "ExpenseAggregatorRecordsQueryAndUpdates.checkUniquenessOfExpenseAggregatorRecord : " +
                    " ExpenseAggregator Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfExpenseAggregatorRecord", failureMessage, http_response);

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
 * @param {String} recordName  : Name of the record to be updated
 * @param {Int} recordCurrentUsedQuantity  : Current Used Quantity to be updated in the record data
 *
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

/****** Code needs to be updated for Update Operation to work ******/
exports.updateExpenseAggregatorRecordInDatabase = function (dbConnection, collectionName, recordName, recordCurrentUsedQuantity,
    http_response) {


    // Update ExpenseAggregator Record with current used quantity

    console.log("updateExpenseAggregatorRecordInDatabase => collectionName :" + collectionName);

    var updateRecordsToDBQuery = getMySqlQueryForRecordUpdation(collectionName, recordCurrentUsedQuantity, recordName);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, updateRecordsToDBQuery, "UpdateExpenseAggregator", http_response);

}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {String} recordName  : Name of the record to be updated
 * @param {Int} recordCurrentUsedQuantity  : Current Used Quantity to be updated in the record data
 *
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

/****** Code needs to be updated for Query/Retrieval Operation to work ******/

exports.retrieveRecordsFromExpenseAggregatorDetailsDatabase = function (dbConnection, collectionName, recordName, http_response)
{

    // Retrieve ExpenseAggregator Records with current record name

    console.log("retrieveRecordFromExpenseAggregatorDetailsDatabase => collectionName :" + collectionName);

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, recordName);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("retrieveRecordFromExpenseAggregatorDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "retrieveRecordFromExpenseAggregatorDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromExpenseAggregatorDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("retrieveRecordFromExpenseAggregatorDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully retrieved the records from the Collection : " + collectionName;
            //HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);

            InventoryRecordsQueryAndUpdatesModule.handleQueryResults(result, http_response);
        }
    });
}



