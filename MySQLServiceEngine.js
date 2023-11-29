
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

var globalsForServiceModule = require('./GlobalsForService');
var HelperUtilsModule = require('./HelperUtils');

var UserAuthenticationModule = require('./UserAuthentication');

var UserRecordsQueryAndUpdatesModule = require('./UserRecordsQueryAndUpdates');
var CompanyRecordsQueryAndUpdatesModule = require('./CompanyRecordsQueryAndUpdates');
var InventoryRecordsQueryAndUpdatesModule = require('./InventoryRecordsQueryAndUpdates');
var StatusTrackingRecordsQueryAndUpdatesModule = require('./StatusTrackingRecordsQueryAndUpdates');

var mySqlConnection = require('mysql');


var mySqlInventoryDBClient = mySqlConnection.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "Abcde_12345",
        database: "designyourrequotationdb"
    }
);



/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

exports.handleUserRecordRequestsMySql = function (webClientRequest, clientRequestWithParamsMap, http_response) {

    if (!globalsForServiceModule.mySqlDBConnected) {

        mySqlInventoryDBClient.connect(function (err) {

            console.log("Inside the connection to InventoryDetails MySql DB");

            if (err != null) {

                console.error("MySQLServiceEngine.handleInventoryRecordRequestsMySql : Server Error while connecting to InventoryDetails mysql db on local server : " + err);

                var failureMessage = "MySQLServiceEngine.handleInventoryRecordRequestsMySql : Server Error while connecting to InventoryDetails mysql db on local server :" + err;
                HelperUtilsModule.logInternalServerError("MySQLServiceEngine.handleInventoryRecordRequestsMySql", failureMessage, http_response);

                return;
            }
        });
    }

    globalsForServiceModule.mySqlDBConnected = true;

    console.log("Successfully connected to UserDetails table of mysqlDb : ");

    // Table( Collection ) Creation

    console.log("Created / retrieved Collection ( Table ) : Now taking care of User Record CRUD operations");

    // Redirect the web Requests based on Query => Client_Request

    switch (webClientRequest) {

        case "UserRegistration":

            console.log("Adding User Registration Record to Database => clientRequestWithParamsMap.get(UserName) : ",
                clientRequestWithParamsMap.get("UserName"));

            UserRecordsQueryAndUpdatesModule.addUserRecordToDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.userDetails_TableName,
                clientRequestWithParamsMap,
                globalsForServiceModule.userRegistrationDataRequiredFields,
                http_response);

            console.log("handleUserRecordRequestsMySql : Successfully placed User Registration call");

            break;

        case "UserAuthentication":

            UserAuthenticationModule.validateUserCredentials(mySqlInventoryDBClient,
                globalsForServiceModule.userDetails_TableName,
                clientRequestWithParamsMap,
                http_response);
            
            console.log("DesignYourREQuotationWebService.handleUserRecordRequestsMySql : " +
                "Successfully placed User Authentication call");

            break;

        case "UpdateUserProfile":

            console.log("Updating User Profile in User Details Database => clientRequestWithParamsMap.get(UserId) : ",
                clientRequestWithParamsMap.get("UserId"));

            UserRecordsQueryAndUpdatesModule.updateUserRecordInDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.userDetails_TableName,
                clientRequestWithParamsMap,
                globalsForServiceModule.userRegistrationDataRequiredFields,
                http_response);

            console.log("DesignYourREQuotationWebService.createServer : Successfully placed UserProfile Update call");

            break;

        case "RetrieveUserDetails":

            console.log("DesignYourREQuotationWebService.handleUserRecordRequestsMySql : Inside User Details Switch : " +
                "RetrieveUserRecordDetails : User Id : " + clientRequestWithParamsMap.get("UserId"));

            // DB query & Reponse Building

            UserRecordsQueryAndUpdatesModule.retrieveRecordsFromUserDetailsDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.userDetails_TableName,
                clientRequestWithParamsMap.get("UserId"),
                http_response);

            console.log("DesignYourREQuotationWebService.handleUserRecordRequestsMySql : Switch Statement : " +
                "Successfully placed Retrieve_Inventory_Records call");

            break;


        default:

            console.error("DesignYourREQuotationWebService.createServer : Inappropriate Web Client Request received...exiting");

            var failureMessage = "DesignYourREQuotationWebService : Inappropriate Web Client Request received...exiting";
            HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

            break;

    }

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to Inventory Item records
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

exports.handleInventoryRecordRequestsMySql = function (webClientRequest, clientRequestWithParamsMap, http_response) {

    if (!globalsForServiceModule.mySqlDBConnected) {

        mySqlInventoryDBClient.connect(function (err) {

            console.log("Inside the connection to InventoryDetails MySql DB");

            if (err != null) {

                console.error("MySQLServiceEngine.handleInventoryRecordRequestsMySql : Server Error while connecting to InventoryDetails mysql db on local server : " + err);

                var failureMessage = "MySQLServiceEngine.handleInventoryRecordRequestsMySql : Server Error while connecting to InventoryDetails mysql db on local server :" + err;
                HelperUtilsModule.logInternalServerError("MySQLServiceEngine.handleInventoryRecordRequestsMySql", failureMessage, http_response);

                return;
            }
        });
    }

    globalsForServiceModule.mySqlDBConnected = true;

    console.log("Successfully connected to InventoryDetails mysqlDb : ");

    // Table( Collection ) Creation

    console.log("Created / retrieved Collection ( Table ) : Now taking care of Inventory CRUD operations");

    // Redirect the web Requests based on Query => Client_Request

    switch (webClientRequest) {

        case "AddInventory":

            InventoryRecordsQueryAndUpdatesModule.addInventoryRecordToDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap,
                globalsForServiceModule.inventoryRecordRequiredFields,
                http_response);

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Successfully placed Add Inventory Record call");

            break;

        case "UpdateInventory":

            InventoryRecordsQueryAndUpdatesModule.updateInventoryRecordInDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                clientRequestWithParamsMap.get("Used_Quantity"),
                http_response);

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Successfully placed Update Inventory Record call");

            break;

        case "RetrieveInventoryDetails":

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Inside Inventory Details Switch : " +
                "RetrieveInventoryDetails : InventoryName : " + clientRequestWithParamsMap.get("Name"));

            // DB query & Reponse Building

            InventoryRecordsQueryAndUpdatesModule.retrieveRecordsFromInventoryDetailsDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                http_response);

            console.log("DesignYourREQuotationWebService.createServer : Switch Statement : " +
                "Successfully placed Retrieve_Inventory_Records call");

            break;

        default:

            console.error("DesignYourREQuotationWebService.createServer : Inappropriate WebClient Request received...exiting");

            var failureMessage = "DesignYourREQuotationWebService : Inappropriate WebClient Request received...exiting";
            HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

            break;

    }

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to Inventory Item records
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

exports.handleCompanyRecordRequestsMySql = function (webClientRequest, clientRequestWithParamsMap, http_response) {

    if (!globalsForServiceModule.mySqlDBConnected) {

        mySqlInventoryDBClient.connect(function (err) {

            console.log("Inside the connection to Design Your RE Quotation MySql DB");

            if (err != null) {

                console.error("MySQLServiceEngine.handleCompanyRecordRequestsMySql : Server Error while connecting to Design Your RE Quotation MySql DB on local server : " + err);

                var failureMessage = "MySQLServiceEngine.handleCompanyRecordRequestsMySql : Server Error while connecting to Design Your RE Quotation mysql db on local server :" + err;
                HelperUtilsModule.logInternalServerError("MySQLServiceEngine.handleCompanyRecordRequestsMySql", failureMessage, http_response);

                return;
            }
        });
    }

    globalsForServiceModule.mySqlDBConnected = true;

    console.log("Successfully connected to handleCompanyRecordRequestsMySql mysqlDb : ");

    // Table( Collection ) Creation

    console.log("Created / retrieved Collection ( Table ) : Now taking care of Company Records CRUD operations");

    // Redirect the web Requests based on Query => Client_Request

    switch (webClientRequest) {

        case "AddCompany":

            CompanyRecordsQueryAndUpdatesModule.addCompanyRecordToDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.companies_Table_Name,
                clientRequestWithParamsMap,
                globalsForServiceModule.companyRecordRequiredFields,
                http_response);

            console.log("MySQLServiceEngine.handleCompanyRecordRequestsMySql : Successfully placed Add Company Record call");

            break;

        /*
        case "UpdateCompany":

            InventoryRecordsQueryAndUpdatesModule.updateInventoryRecordInDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                clientRequestWithParamsMap.get("Used_Quantity"),
                http_response);

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Successfully placed Update Inventory Record call");

            break;

        case "RetrieveCompanyDetails":

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Inside Inventory Details Switch : " +
                "RetrieveInventoryDetails : InventoryName : " + clientRequestWithParamsMap.get("Name"));

            // DB query & Reponse Building

            InventoryRecordsQueryAndUpdatesModule.retrieveRecordsFromInventoryDetailsDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                http_response);

            console.log("DesignYourREQuotationWebService.createServer : Switch Statement : " +
                "Successfully placed Retrieve_Inventory_Records call");

            break;
        */

        default:

            console.error("DesignYourREQuotationWebService.createServer : Inappropriate WebClient Request received...exiting");

            var failureMessage = "DesignYourREQuotationWebService : Inappropriate WebClient Request received...exiting";
            HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

            break;

    }

}


/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to Status Tracking Item records
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

exports.handleStatusTrackingRecordRequestsMySql = function (webClientRequest, clientRequestWithParamsMap, http_response) {

    if (!globalsForServiceModule.mySqlDBConnected) {

        mySqlInventoryDBClient.connect(function (err) {

            console.log("Inside the connection to Design Your RE Quotation MySql DB");

            if (err != null) {

                console.error("MySQLServiceEngine.handleStatusTrackingRecordRequestsMySql : Server Error while connecting to Design Your RE Quotation MySql DB on local server : " + err);

                var failureMessage = "MySQLServiceEngine.handleStatusTrackingRecordRequestsMySql : Server Error while connecting to Design Your RE Quotation mysql db on local server :" + err;
                HelperUtilsModule.logInternalServerError("MySQLServiceEngine.handleStatusTrackingRecordRequestsMySql", failureMessage, http_response);

                return;
            }
        });
    }

    globalsForServiceModule.mySqlDBConnected = true;

    console.log("Successfully connected to handleStatusTrackingRecordRequestsMySql mysqlDb : ");

    // Table( Collection ) Creation

    console.log("Created / retrieved Collection ( Table ) : Now taking care of StatusTracking Records CRUD operations");

    // Redirect the web Requests based on Query => Client_Request

    switch (webClientRequest) {

        case "AddStatus":

            StatusTrackingRecordsQueryAndUpdatesModule.addStatusTrackingRecordToDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.statusTracking_Table_Name,
                clientRequestWithParamsMap,
                globalsForServiceModule.statusTrackingRecordRequiredFields,
                http_response);

            console.log("MySQLServiceEngine.handleStatusTrackingRecordRequestsMySql : Successfully placed Add Status Record call");

            break;

        /*
        case "UpdateStatus":

            InventoryRecordsQueryAndUpdatesModule.updateInventoryRecordInDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                clientRequestWithParamsMap.get("Used_Quantity"),
                http_response);

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Successfully placed Update Inventory Record call");

            break;

        case "RetrieveStatusDetails":

            console.log("DesignYourREQuotationWebService.handleInventoryRecordRequestsMySql : Inside Inventory Details Switch : " +
                "RetrieveInventoryDetails : InventoryName : " + clientRequestWithParamsMap.get("Name"));

            // DB query & Reponse Building

            InventoryRecordsQueryAndUpdatesModule.retrieveRecordsFromInventoryDetailsDatabase(mySqlInventoryDBClient,
                globalsForServiceModule.inventoryDetails_Table_Name,
                clientRequestWithParamsMap.get("Item_Name"),
                http_response);

            console.log("DesignYourREQuotationWebService.createServer : Switch Statement : " +
                "Successfully placed Retrieve_Inventory_Records call");

            break;
        */

        default:

            console.error("MySQLServiceEngine.handleStatusTrackingRecordRequestsMySql : Inappropriate WebClient Request received...exiting");

            var failureMessage = "handleStatusTrackingRecordRequestsMySql : Inappropriate WebClient Request received...exiting";
            HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

            break;

    }

}



