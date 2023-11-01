
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

var InventoryRecordsQueryAndUpdatesModule = require('./InventoryRecordsQueryAndUpdates');

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

    var DesignYourREQuotation_Database_Name_1;

    globalsForServiceModule.mysqlClient.connect(globalsForServiceModule.mysqlDesignYourREQuotationDbUrl, function (err, db) {

        console.log("Inside the connection to DesignYourREQuotation mysql DB");

        if (err != null) {

            console.error("DesignYourREQuotationWebService.createServer : Server Error while connecting to DesignYourREQuotation mysql db on local server :"
                + globalsForServiceModule.mysqlDesignYourREQuotationDbUrl);

            var failureMessage = "DesignYourREQuotationWebService.createServer : Server Error while connecting to DesignYourREQuotation mysql db on local server :"
                + globalsForServiceModule.mysqlDesignYourREQuotationDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

        } else {

            console.log("Successfully connected to DesignYourREQuotation Details mysqlDb : " + globalsForServiceModule.mysqlDesignYourREQuotationDbUrl);

            // Database Creation

            console.log("Creating / Retrieving User Details Database : ");
            DesignYourREQuotation_Database_Name_1 = db.db(globalsForServiceModule.DesignYourREQuotation_Database_Name);

            // Table( Collection ) Creation

            DesignYourREQuotation_Database_Name_1.createCollection(globalsForServiceModule.userDetails_TableName, function (err, result) {

                if (err) {

                    console.error("DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mysqlDb : "
                        + globalsForServiceModule.userDetails_TableName);

                    var failureMessage = "DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mysqlDb : "
                        + globalsForServiceModule.userDetails_TableName;
                    HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (userDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of User Registration and Authentication");

                // Redirect the web Requests based on Query Key => Client_Request

                switch (webClientRequest) {

                    case "UserRegistration":

                        console.log("Adding User Registration Record to Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.addUserRecordToDatabase(DesignYourREQuotation_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed User Registration call");

                        break;

                    case "UserAuthentication":

                        UserAuthenticationModule.validateUserCredentials(DesignYourREQuotation_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed User Authentication call");

                        break;

                    case "UpdateUserProfile":

                        console.log("Updating User Profile in User Details Database => clientRequestWithParamsMap.get(UserName) : ",
                            clientRequestWithParamsMap.get("UserName"));

                        UserRecordsQueryAndUpdatesModule.updateUserRecordInDatabase(DesignYourREQuotation_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.userRegistrationData_RequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed UserProfile Update call");

                        break;

                    case "RetrieveUserDetails":

                        console.log("DesignYourREQuotationWebService.createServer : Inside User Registration & Auth Switch : " +
                            "RetrieveUserDetails : UserName : " + clientRequestWithParamsMap.get("UserName"));

                        // Build Query

                        var queryMap = new Map();
                        var userName = clientRequestWithParamsMap.get("UserName");

                        if (HelperUtilsModule.valueDefined(userName)) {

                            queryMap.set("UserName", userName);
                        }

                        // DB query & Reponse Building

                        UserRecordsQueryAndUpdatesModule.retrieveRecordFromUserDetailsDatabase(DesignYourREQuotation_Database_Name,
                            globalsForServiceModule.userDetails_TableName,
                            queryMap,
                            UserRecordsQueryAndUpdatesModule.handleQueryResults,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Switch Statement : " +
                            "Successfully placed RetrieveUserDetails call");

                        break;

                    default:

                        console.error("DesignYourREQuotationWebService.createServer : Inappropriate Web Client Request received...exiting");

                        var failureMessage = "DesignYourREQuotationWebService : Inappropriate Web Client Request received...exiting";
                        HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

                        break;

                }

            });

        }

    });

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




