
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
 * Company Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Company database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addCompanyRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection,
    http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addCompanyRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addCompanyRecordToDatabase : All <K,V> pairs are present, Adding Company Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Company Object and add to the Company Details Database

    var companyRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.companyRecordRequiredFields,
        GlobalsForServiceModule.companyRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.companyRecordRequiredFields,
        GlobalsForServiceModule.companyRecordDBColumns);

    // Remove spaces from user_object values before adding to MongoDB

    companyRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(companyRecordObject);

    checkUniquenessAndAddCompanyRecord(dbConnection,
        collectionName,
        companyRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "AddCompanyRecord",
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

function checkUniquenessAndAddCompanyRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfCompanyRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.CompanyRecordData_UniqueFields,
        document_Object);
    */

    console.log("Adding New Company record data => " + " Company Name : " + document_Object.CompanyName);

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.companyRecordRequiredFields);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

/*
    // Register Company Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("CompanyRecordsQueryAndUpdates.checkUniquenessOfCompanyRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "CompanyRecordsQueryAndUpdates.checkUniquenessOfCompanyRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfCompanyRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating Company registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered Company Data is unique, Adding New Record => " + " Company_Id : " + document_Object.Company_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("CompanyRecordsQueryAndUpdates.checkUniquenessOfCompanyRecord : " +
                    " Company Record already exists with current unique field values : ");

                var failureMessage = "CompanyRecordsQueryAndUpdates.checkUniquenessOfCompanyRecord : " +
                    " Company Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfCompanyRecord", failureMessage, http_response);

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

exports.updateCompanyRecordInDatabase = function (dbConnection, collectionName, recordName, recordCurrentUsedQuantity,
    http_response) {


    // Update Company Record with current used quantity

    console.log("updateCompanyRecordInDatabase => collectionName :" + collectionName);

    var updateRecordsToDBQuery = getMySqlQueryForRecordUpdation(collectionName, recordCurrentUsedQuantity, recordName);

    MySqlDbCrudModule.directQueryAndUpdateRecordsToDatabase(dbConnection, collectionName, updateRecordsToDBQuery, "UpdateCompany", http_response);

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

exports.retrieveRecordsFromCompanyDetailsDatabase = function (dbConnection, collectionName, recordName, http_response)
{

    // Retrieve Company Records with current record name

    console.log("retrieveRecordFromCompanyDetailsDatabase => collectionName :" + collectionName);

    var retrieveRecordsFromDBQuery = getMySqlQueryForRecordRetrieval(collectionName, recordName);

    dbConnection.query(retrieveRecordsFromDBQuery, function (err, result) {

        if (err) {
            console.error("retrieveRecordFromCompanyDetailsDatabase : Error while retrieving the Records from Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "retrieveRecordFromCompanyDetailsDatabase : Internal Server Error while retrieving the Records from Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromCompanyDetailsDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("retrieveRecordFromCompanyDetailsDatabase : Successfully retrieved the records from the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully retrieved the records from the Collection : " + collectionName;
            //HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);

            CompanyRecordsQueryAndUpdateModule.handleQueryResults(result, http_response);
        }
    });
}



