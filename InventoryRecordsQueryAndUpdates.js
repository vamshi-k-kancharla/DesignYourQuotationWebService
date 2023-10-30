
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
var cryptoModule = require('crypto');
var QueryBuilderModule = require('./QueryBuilder');

var MySqlDbCrudModule = require('./MySqlDbCRUD');

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Inventory Records  : Record Retrievals and Updates Module
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {Object} queryResult  : Result object of the Web Cient query
 * @param {XMLHttpRequest} http_request  : http request passed from web service handler
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.handleQueryResults = function (queryResult, http_response) {

    console.log("Callback Function (handleQueryResults) : Successfully retrieved the records through function " +
        "(mongoDbCrudModule.retrieveRecordsFromDatabase) => ");
    console.log(queryResult);

    var queryResponse_JSON_String = buildQueryResponse_JSON(queryResult);

    // Build Success Response with Query Results

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(queryResponse_JSON_String);

    console.log("InventoryRecordsQueryAndUpdates.handleQueryResults: Written Success response for input query : Response => " +
        queryResponse_JSON_String);
}


/**
 * 
 * @param {Object} queryResult  : query Response received from Mongo DB
 * 
 * @returns {String} queryResponse_InventoryRecord_JSON_String  : JSON String of Retrieved Inventory Record(s)
 *
 */

function buildQueryResponse_JSON(queryResult) {

    var queryResponse_InventoryRecord_JSON_String = "";

    for (var i = 0; i < queryResult.length; i++) {

        var currentRecord = queryResult[i];

        if (HelperUtilsModule.valueDefined(currentRecord.Inventory_Id)) {

            queryResponse_InventoryRecord_JSON_String += JSON.stringify(RecordHelperUtilsModule.buildJSONRecord(currentRecord,
                GlobalsForServiceModule.userRegistrationData_RequiredFields));
            queryResponse_InventoryRecord_JSON_String += "\n";
        }

    }

    return queryResponse_InventoryRecord_JSON_String;
}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * 
 * @param {Map} clientRequestWithParamsMap : Map of <K,V> Pairs ( Record ) used to generate LC
 * @param {Function} handleQueryResults  : Call back function to handle the Query Results
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.retrieveRecordFromInventoryDetailsDatabase = function (dbConnection, collectionName, clientRequestWithParamsMap,
    handleQueryResults, http_response) {

    // Inventory Record Retrieval based on "Inventory_Id || Name || Inventory_Type || Email || Location || Address || InventoryName || Password"

    var queryObject = new Object();

    var userRecordDetails = GlobalsForServiceModule.userRegistrationData_RequiredFields;
    var parameterList = " ";

    // Fill the record document object values

    for (var currentDetailOfRecord of userRecordDetails) {

        if (HelperUtilsModule.valueDefined(clientRequestWithParamsMap.get(currentDetailOfRecord))) {

            parameterList += currentDetailOfRecord;
            parameterList += " : ";
            parameterList += clientRequestWithParamsMap.get(currentDetailOfRecord);
            parameterList += ", ";

            queryObject[currentDetailOfRecord] = clientRequestWithParamsMap.get(currentDetailOfRecord);
        }
    }

    console.log("InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase => collectionName :"
        + collectionName + ", queryObject.length :" + Object.keys(queryObject).length);
    console.log("InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Called with Parameter List : " + parameterList);

    // Remove URL representation of spaces

    queryObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(queryObject);

    // Query for Inventory Records

    if (Object.keys(queryObject).length > 0) {

        dbConnection.collection(collectionName).find(queryObject).toArray(function (err, result) {

            if (err) {

                var failureMessage = "InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Internal Server Error while querying for specific Records from InventoryDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromInventoryDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Successfully retrieved queried records => ");
            console.log(result);

            if (result == null || result == undefined) {

                var failureMessage = "InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Null Records returned for InventoryDetails Record query";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromInventoryDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);
        });

    } else {

        dbConnection.collection(collectionName).find({}).toArray(function (err, result) {

            if (err) {

                var failureMessage = "InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Internal Server Error while querying for all the Records from InventoryDetails Database : " + err;
                HelperUtilsModule.logInternalServerError("retrieveRecordFromInventoryDetailsDatabase", failureMessage, http_response);

                return;
            }

            console.log("InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Successfully retrieved all the records => ");
            console.log(result);

            if (!HelperUtilsModule.valueDefined(result)) {

                var failureMessage = "InventoryRecordsQueryAndUpdates.retrieveRecordFromInventoryDetailsDatabase : Null Records returned for InventoryDetails Record query For All Records";
                HelperUtilsModule.logBadHttpRequestError("retrieveRecordFromInventoryDetailsDatabase", failureMessage, http_response);

                return;
            }

            return handleQueryResults(result, http_response);

        });

    }

}


/**
 *
 * @param {DbConnection} dbConnection  : Connection to database
 * @param {String} collectionName  : Name of Table ( Collection )
 *
 * @param {Map} recordObjectMap : Map of <K,V> Pairs ( Record ), to be added to Inventory database
 * @param {Collection} requiredDetailsCollection : required keys for record addition
 * @param {XMLHttpRequestResponse} http_response : http response to be filled while responding to web client request
 *
 */

exports.addInventoryRecordToDatabase = function (dbConnection, collectionName, recordObjectMap, requiredDetailsCollection,
    http_response) {


    // Check if all the required fields are present before adding the record

    if (!RecordHelperUtilsModule.checkForMissingFields(recordObjectMap, requiredDetailsCollection, http_response)) {

        console.log("addInventoryRecordToDatabase : check for missing fields failed");
        return;
    }

    console.log("addInventoryRecordToDatabase : All <K,V> pairs are present, Adding Inventory Record of Num Of Pairs => " + requiredDetailsCollection.length);

    // Prepare the Inventory Object and add to the Inventory Details Database

    var inventoryRecordObject = RecordHelperUtilsModule.prepareRecord_DocumentObject(recordObjectMap, requiredDetailsCollection);

    var recordTypesObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.inventoryRecordRequiredFields,
        GlobalsForServiceModule.inventoryRecordTypes);

    var recordDbColumnsObject = RecordHelperUtilsModule.createMatchingRecordObject(
        GlobalsForServiceModule.inventoryRecordRequiredFields,
        GlobalsForServiceModule.inventoryRecordDBColumns);

    // Remove spaces from user_object values before adding to MongoDB

    inventoryRecordObject = HelperUtilsModule.removeUrlSpacesFromObjectValues(inventoryRecordObject);

    checkUniquenessAndAddInventoryRecord(dbConnection,
        collectionName,
        inventoryRecordObject,
        recordTypesObject,
        recordDbColumnsObject,
        "AddInventoryRecord",
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

function checkUniquenessAndAddInventoryRecord(dbConnection, collectionName, document_Object, document_TypesObject,
    document_ColumnsObject, clientRequest, http_response) {

    console.log("checkUniquenessOfInventoryRecord => collectionName :" + collectionName);

    /*
    var queryObject = QueryBuilderModule.buildQuery_MatchAnyField(GlobalsForServiceModule.inventoryRecordData_UniqueFields,
        document_Object);
    */

    console.log("Adding New inventory record data => " + " Item_Name : " + document_Object.Item_Name);

    var addRecordsToDBQuery = MySqlDbCrudModule.getGenericMySqlQueryForRecordAddition(collectionName, document_Object, document_TypesObject,
        document_ColumnsObject, GlobalsForServiceModule.inventoryRecordRequiredFields);

    MySqlDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response);

/*
    // Register Inventory Record

    if (queryObject) {

        dbConnection.collection(collectionName).findOne(queryObject, function (err, result) {

            if (err) {

                console.error("InventoryRecordsQueryAndUpdates.checkUniquenessOfInventoryRecord : " +
                    "Internal Server Error while checking uniqueness of input Record");

                var failureMessage = "InventoryRecordsQueryAndUpdates.checkUniquenessOfInventoryRecord : " +
                    "Internal Server Error while checking uniqueness of input Record";
                HelperUtilsModule.logInternalServerError("checkUniquenessOfInventoryRecord", failureMessage, http_response);

                return;
            }

            var recordPresent = (result) ? "true" : "false";

            if (recordPresent == "false") {

                // Record Not Present. Add Record during last uniqueness check

                // Encrypt Password before Registering/Updating Inventory registration record

                document_Object.Password = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');

                // Record Addition

                console.log("Entered Inventory Data is unique, Adding New Record => " + " Inventory_Id : " + document_Object.Inventory_Id);
                MongoDbCrudModule.directAdditionOfRecordToDatabase(dbConnection, collectionName, document_Object, clientRequest, http_response);

            }
            else {

                console.error("InventoryRecordsQueryAndUpdates.checkUniquenessOfInventoryRecord : " +
                    " Inventory Record already exists with current unique field values : ");

                var failureMessage = "InventoryRecordsQueryAndUpdates.checkUniquenessOfInventoryRecord : " +
                    " Inventory Record already exists with current unique field values : ";
                HelperUtilsModule.logBadHttpRequestError("checkUniquenessOfInventoryRecord", failureMessage, http_response);

                return;
            }

        });

    } 
    */

}

/**
 * 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} inputParamsObject : Document object to be added ( Record, Row in Table )
 * @param {Record} inputTypesObject : Data Types of Add Record to be added to Collection / Table
 * 
 * @returns {String} AddRecordsMySqlQuery : Query for the add records to be added to input collection
 *
 */

function getMySqlQueryForRecordAddition(collectionName, inputParamsObject, inputTypesObject, inputDBColumnsObject) {

    var addRecordsMySqlQuery = "INSERT INTO " + collectionName +
        " (name, totalQuantity, purchaseDate, PricePerUnit, TotalAmount, UsedQuantity) " +
        " VALUES (" + "'" + inputParamsObject["Item_Name"] + "', " +
        inputParamsObject["Total_Quantity"] + ", '" +
        inputParamsObject["Date_Of_Purchase"] + "', " +
        inputParamsObject["Price_Per_Unit"] + ", " +
        inputParamsObject["Total_Amount"] + ", " +
        inputParamsObject["Used_Quantity"] + ")";

    console.log("getMySqlQueryForRecordAddition : Retrieved the mysql query to add records to the database => " +
        addRecordsMySqlQuery);

    return addRecordsMySqlQuery;

}


