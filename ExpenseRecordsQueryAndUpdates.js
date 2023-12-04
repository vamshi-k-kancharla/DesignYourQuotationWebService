
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
 * Expense Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Expense database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addExpenseRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection,
    http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addExpenseRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addExpenseRecordToDatabase : All <K,V> pairs are present, Adding Expense Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Expense Object and add to the Expense Details Database

    var expenseRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.expenseRecordRequiredFields,
        GlobalsForServiceModule.expenseRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.expenseRecordRequiredFields,
        GlobalsForServiceModule.expenseRecordDBColumns);

    // Remove spaces from expense_object values before adding to MongoDB

    expenseRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(expenseRecordObject);

    checkUniquenessAndAddExpenseRecord(dbConnection,
        collectionName,
        expenseRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "AddExpenseRecord",
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

function checkUniquenessAndAddExpenseRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfExpenseRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.ExpenseRecordData_UniqueFields,
        document_Object);
    */

    console.log("Adding New Expense record data => " + " Aggregator Name : " + document_Object.AggregatorName);

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.expenseRecordRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

/*
    // Register Expense Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("ExpenseRecordsQueryAndUpdates.checkUniquenessOfExpenseRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "ExpenseRecordsQueryAndUpdates.checkUniquenessOfExpenseRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfExpenseRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating Expense registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered Expense Data is unique, Adding New Record => " + " Expense_Id : " + document_Object.Expense_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("ExpenseRecordsQueryAndUpdates.checkUniquenessOfExpenseRecord : " +
                    " Expense Record already exists with current unique field values : ");

                var failureMessage = "ExpenseRecordsQueryAndUpdates.checkUniquenessOfExpenseRecord : " +
                    " Expense Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfExpenseRecord", failureMessage, http_response);

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
exports.updateExpenseRecordInDatabase = function (dbConnection, collectionName, recordName, recordCurrentUsedQuantity,
    http_response) {


    // Update Expense Record with current used quantity

    console.log("updateExpenseRecordInDatabase => collectionName :" + collectionName);

    var updateRecordsToDBQuery = getMySqlQueryForRecordUpdation(collectionName, recordCurrentUsedQuantity, recordName);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, updateRecordsToDBQuery, "UpdateExpense", http_response);

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

exports.retrieveRecordsFromExpenseDetailsDatabase = function (dbConnection, collectionName, recordName, http_response)
{

    // Retrieve Expense Records with current record name

    console.log("retrieveRecordFromExpenseDetailsDatabase => collectionName :" + collectionName);

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, recordName);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("retrieveRecordFromExpenseDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "retrieveRecordFromExpenseDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromExpenseDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("retrieveRecordFromExpenseDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully retrieved the records from the Collection : " + collectionName;
            //HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);

            InventoryRecordsQueryAndUpdatesModule.handleQueryResults(result, http_response);
        }
    });
}



