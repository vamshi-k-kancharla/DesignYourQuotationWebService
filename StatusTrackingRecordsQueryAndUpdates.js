
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
 * StatusTracking Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to StatusTracking database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addStatusTrackingRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection,
    http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addStatusTrackingRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addStatusTrackingRecordToDatabase : All <K,V> pairs are present, Adding StatusTracking Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the StatusTracking Object and add to the StatusTracking Details Database

    var statusTrackingRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.statusTrackingRecordRequiredFields,
        GlobalsForServiceModule.statusTrackingRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.statusTrackingRecordRequiredFields,
        GlobalsForServiceModule.statusTrackingRecordDBColumns);

    // Remove spaces from user_object values before adding to MongoDB

    statusTrackingRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(statusTrackingRecordObject);

    checkUniquenessAndAddStatusTrackingRecord(dbConnection,
        collectionName,
        statusTrackingRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "AddStatusRecord",
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

function checkUniquenessAndAddStatusTrackingRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfStatusTrackingRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.StatusTrackingRecordData_UniqueFields,
        document_Object);
    */

    console.log("Adding New StatusTracking record data => " + " Company Name & Project Name : " + document_Object.CompanyName + "&" + document_Object.ProjectName);

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.statusTrackingRecordRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

/*
    // Register StatusTracking Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("StatusTrackingRecordsQueryAndUpdates.checkUniquenessOfStatusTrackingRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "StatusTrackingRecordsQueryAndUpdates.checkUniquenessOfStatusTrackingRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfStatusTrackingRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating StatusTracking registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered StatusTracking Data is unique, Adding New Record => " + " StatusTracking_Id : " + document_Object.StatusTracking_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("StatusTrackingRecordsQueryAndUpdates.checkUniquenessOfStatusTrackingRecord : " +
                    " StatusTracking Record already exists with current unique field values : ");

                var failureMessage = "StatusTrackingRecordsQueryAndUpdates.checkUniquenessOfStatusTrackingRecord : " +
                    " StatusTracking Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfStatusTrackingRecord", failureMessage, http_response);

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

/****** Code need to be updated for Update Operation to work ******/
exports.updateStatusTrackingRecordInDatabase = function (dbConnection, collectionName, recordName, recordCurrentUsedQuantity,
    http_response) {


    // Update StatusTracking Record with current used quantity

    console.log("updateStatusTrackingRecordInDatabase => collectionName :" + collectionName);

    var updateRecordsToDBQuery = getMySqlQueryForRecordUpdation(collectionName, recordCurrentUsedQuantity, recordName);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, updateRecordsToDBQuery, "UpdateStatusTracking", http_response);

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

/****** Code need to be updated for Query/Retrieval Operation to work ******/

exports.retrieveRecordsFromStatusTrackingDetailsDatabase = function (dbConnection, collectionName, recordName, http_response)
{

    // Retrieve StatusTracking Records with current record name

    console.log("retrieveRecordFromStatusTrackingDetailsDatabase => collectionName :" + collectionName);

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, recordName);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("retrieveRecordFromStatusTrackingDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "retrieveRecordFromStatusTrackingDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromStatusTrackingDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("retrieveRecordFromStatusTrackingDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully retrieved the records from the Collection : " + collectionName;
            //HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);

            InventoryRecordsQueryAndUpdatesModule.handleQueryResults(result, http_response);
        }
    });
}



