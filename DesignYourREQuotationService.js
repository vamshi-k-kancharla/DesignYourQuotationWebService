
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

var http = require('http');
var url = require('url');

var globalsForServiceModule = require('./GlobalsForService');
var HelperUtilsModule = require('./HelperUtils');

var UserAuthenticationModule = require('./UserAuthentication');
var UserRecordsQueryAndUpdatesModule = require('./UserRecordsQueryAndUpdates');

var MySqlServiceEngine = require('./MySQLServiceEngine');


/********************************************************************************
 ********************************************************************************
 * 
 *  Main Service Module : DesignYourREQuotation Web Service
 *  
 *  Start DesignYourREQuotation Web Server and serve requests from web client
 *
 ********************************************************************************
 ********************************************************************************
 */

/**
 * 
 * @param {XMLHttpRequest} http_request  : HTTP Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

http.createServer(function (http_request, http_response) {

    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    if (http_request.url == null || http_request.url == "/favicon.ico") {

        console.log("unexpected http_request.url : " + http_request.url);
        return;
    }

    console.log("Content-Length : " + http_request.headers["content-length"]);
    console.log("Content-Disposition : " + http_request.headers["content-disposition"]);
    console.log("Content-Type : " + http_request.headers["content-type"]);
    console.log("referer : " + http_request.headers.referer);

    http_response.setHeader("Access-Control-Allow-Origin", "*");
    http_response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    // Parse the params from Web requests

    console.log("http_request.url : " + http_request.url);
    console.log("http_request.url.query : " + (url.parse(http_request.url)).query);

    var requestParams = (url.parse(http_request.url)).query;

    if (requestParams == null || requestParams == "") {

        console.log("Null /Empty http_request.url.query :");
        return;
    }

    // Extract Query Parameters

    var requestParamsCollection = requestParams.split("&");

    console.log("requestParamsMap after parsing URL : ");
    console.log(requestParamsCollection);

    var clientRequestWithParamsMap = HelperUtilsModule.parseWebClientRequest(requestParamsCollection);
    console.log("Parsed the Web Client Request : " + clientRequestWithParamsMap.get("Client_Request"));

    var webClientRequest = clientRequestWithParamsMap.get("Client_Request");

    // Connect to "DesignYourREQuotation" db for "User Registration & Authentication"

    if (webClientRequest == "UserRegistration" || webClientRequest == "UserAuthentication" ||
        webClientRequest == "RetrieveUserDetails" || webClientRequest == "UpdateUserProfile") {

        if (globalsForServiceModule.backEndDatabase == 'Mongodb') {

            handleUserRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else if (globalsForServiceModule.backEndDatabase == 'MySql') {

            MySqlServiceEngine.handleUserRecordRequestsMySql(webClientRequest, clientRequestWithParamsMap, http_response);

        }

        else {

            logDBUnavailabilityError();
        }

    } else if (webClientRequest == "AddBudget" || webClientRequest == "UpdateBudget" ||
        webClientRequest == "RetrieveBudgetDetails" || webClientRequest == "RemoveBudget") {

        // Connect to "DesignYourREQuotation" db for "Budget Related CRUD operations"

        handleBudgetDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response);

    } else if (webClientRequest == "AddInventory" || webClientRequest == "UpdateInventory" ||
        webClientRequest == "RetrieveInventoryDetails") {

        // Connect to "DesignYourREQuotation" db for "Inventory Related CRUD operations"

        if (globalsForServiceModule.backEndDatabase == 'Mongodb') {

            handleInventoryRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else if (globalsForServiceModule.backEndDatabase == 'MySql') {

            MySqlServiceEngine.handleInventoryRecordRequestsMySql(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else {

            logDBUnavailabilityError();
        }

    } else if (webClientRequest == "AddCompany" || webClientRequest == "UpdateCompany" ||
        webClientRequest == "RetrieveCompanyDetails") {

        // Connect to "DesignYourREQuotation" db for "Company Related CRUD operations"
        
        /*
        if (globalsForServiceModule.backEndDatabase == 'Mongodb') {

            handleInventoryRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else */

        if (globalsForServiceModule.backEndDatabase == 'MySql') {

            MySqlServiceEngine.handleCompanyRecordRequestsMySql(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else {

            logDBUnavailabilityError();
        }

    } else if (webClientRequest == "AddStatus" || webClientRequest == "UpdateStatus" ||
        webClientRequest == "RetrieveStatusDetails") {

        // Connect to "DesignYourREQuotation" db for "Status Tracking Related CRUD operations"

        /*
        if (globalsForServiceModule.backEndDatabase == 'Mongodb') {

            handleStatusTrackingRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else */

        if (globalsForServiceModule.backEndDatabase == 'MySql') {

            MySqlServiceEngine.handleStatusTrackingRecordRequestsMySql(webClientRequest, clientRequestWithParamsMap, http_response);
        }

        else {

            logDBUnavailabilityError();
        }

    } else {

        console.error("DesignYourREQuotationWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting");

        var failureMessage = "DesignYourREQuotationWebService.createServer : Inappropriate/Unsupported WebClient Request received...exiting";
        HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);

    }

    //  close the db connection

    //db.close();
    //console.log("Closed the Db connection successfully");

    delete global.window;
    delete global.navigator;
    delete global.btoa;

}).listen(globalsForServiceModule.port);



/**
 *  Logs Error in backEnd Database missing scenario 
 * 
*/

function logDBUnavailabilityError() {

    console.error("DesignYourREQuotationWebService.createServer : Backend Database is not available. contact admin");

    var failureMessage = "DesignYourREQuotationWebService.createServer : Backend Database is not available. contact admin";
    HelperUtilsModule.logBadHttpRequestError("DesignYourREQuotationWebService", failureMessage, http_response);
}

/**
 * 
 * @param {String} webClientRequest  : http client request 
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleUserRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var DesignYourREQuotation_Database_Name_1;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourREQuotationDbUrl, function (err, db) {

        console.log("Inside the connection to DesignYourREQuotation Mongo DB");

        if (err != null) {

            console.error("DesignYourREQuotationWebService.createServer : Server Error while connecting to DesignYourREQuotation mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            var failureMessage = "DesignYourREQuotationWebService.createServer : Server Error while connecting to DesignYourREQuotation mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

        } else {

            console.log("Successfully connected to DesignYourREQuotation Details MongoDb : " + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            // Database Creation

            console.log("Creating / Retrieving User Details Database : ");
            DesignYourREQuotation_Database_Name_1 = db.db(globalsForServiceModule.DesignYourREQuotation_Database_Name);

            // Table( Collection ) Creation

            DesignYourREQuotation_Database_Name_1.createCollection(globalsForServiceModule.userDetails_TableName, function (err, result) {

                if (err) {

                    console.error("DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
                        + globalsForServiceModule.userDetails_TableName);

                    var failureMessage = "DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in User Details mongoDb : "
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
 * @param {Map} clientRequestWithParamsMap  : Map of <K,V> pairs corresponding to query of Web Client Request
 *
 * @returns {HTTPResponse} http_response  : http_response to be formulated with respective status codes
 * 
*/

function handleBudgetDatabaseRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_BudgetDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourREQuotationDbUrl, function (err, db) {

        console.log("Inside the connection to BudgetDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourREQuotationWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            var failureMessage = "DesignYourREQuotationWebService.createServer : Server Error while connecting to BudgetDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to BudgetDetails MongoDb : " + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            // Database Creation

            console.log("Creating / Retrieving BudgetDetails Database : ");
            dbConnection_BudgetDetails_Database = db.db(globalsForServiceModule.DesignYourREQuotation_Database_Name);

            // Table( Collection ) Creation

            dbConnection_BudgetDetails_Database.createCollection(globalsForServiceModule.budgetDetails_Table_Name, function (err, result) {

                if (err) {

                    console.error("DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in Budget Details mongoDb : "
                        + globalsForServiceModule.budgetDetails_Table_Name);

                    var failureMessage = "DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in Budget Details mongoDb : "
                        + globalsForServiceModule.budgetDetails_Table_Name;
                    HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (budgetDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of Budget CRUD operations");

                // Redirect the web Requests based on Query => Client_Request

                switch (webClientRequest) {

                    case "AddBudget":

                        BudgetRecordsUpdateModule.addBudgetRecordToDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed Add Budget Record call");

                        break;

                    case "UpdateBudget":

                        BudgetRecordsUpdateModule.updateBudgetRecordInDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed Update Budget Record call");

                        break;

                    case "RetrieveBudgetDetails":

                        console.log("DesignYourREQuotationWebService.createServer : Inside Budget Details Switch : " +
                            "RetrieveBudetDetails : BudgetName : " + clientRequestWithParamsMap.get("Name"));

                        // DB query & Reponse Building

                        BudgetRecordsQueryModule.retrieveRecordFromBudgetDetailsDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            BudgetRecordsQueryModule.handleQueryResults,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Switch Statement : " +
                            "Successfully placed Retrieve_Budget_Records call");

                        break;

                    case "RemoveBudget":

                        BudgetRecordsUpdateModule.removeBudgetRecordInDatabase(dbConnection_BudgetDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.budgetRecordRequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed Remove Budget Record call");

                        break;

                    default:

                        console.error("DesignYourREQuotationWebService.createServer : Inappropriate WebClient Request received...exiting");

                        var failureMessage = "DesignYourREQuotationWebService : Inappropriate WebClient Request received...exiting";
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

function handleInventoryRecordRequests(webClientRequest, clientRequestWithParamsMap, http_response) {

    var dbConnection_InventoryDetails_Database;

    globalsForServiceModule.mongoClient.connect(globalsForServiceModule.mongoDesignYourREQuotationDbUrl, function (err, db) {

        console.log("Inside the connection to InventoryDetails Mongo DB");

        if (err != null) {

            console.error("DesignYourREQuotationWebService.createServer : Server Error while connecting to InventoryDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            var failureMessage = "DesignYourREQuotationWebService.createServer : Server Error while connecting to InventoryDetails mongo db on local server :"
                + globalsForServiceModule.mongoDesignYourREQuotationDbUrl;
            HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

        }
        else {

            console.log("Successfully connected to InventoryDetails MongoDb : " + globalsForServiceModule.mongoDesignYourREQuotationDbUrl);

            // Database Creation

            console.log("Creating / Retrieving InventoryDetails Database : ");
            dbConnection_InventoryDetails_Database = db.db(globalsForServiceModule.DesignYourREQuotation_Database_Name);

            // Table( Collection ) Creation

            dbConnection_InventoryDetails_Database.createCollection(globalsForServiceModule.inventoryDetails_Table_Name, function (err, result) {

                if (err) {

                    console.error("DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in Inventory Details mongoDb : "
                        + globalsForServiceModule.inventoryDetails_Table_Name);

                    var failureMessage = "DesignYourREQuotationWebService.createServer : Error while creating / retrieving Collection ( Table ) in Inventory Details mongoDb : "
                        + globalsForServiceModule.inventoryDetails_Table_Name;
                    HelperUtilsModule.logInternalServerError("DesignYourREQuotationWebService.createServer", failureMessage, http_response);

                    return;
                }

                console.log("Successfully created / retrieved collection (inventoryDetailsCollection)");
                console.log("Created / retrieved Collection ( Table ) : Now taking care of Inventory CRUD operations");

                // Redirect the web Requests based on Query => Client_Request

                switch (webClientRequest) {

                    case "AddInventory":

                        InventoryRecordsUpdateModule.addInventoryRecordToDatabase(dbConnection_InventoryDetails_Database,
                            globalsForServiceModule.inventoryDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.inventoryRecordRequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed Add Inventory Record call");

                        break;

                    case "UpdateInventory":

                        InventoryRecordsUpdateModule.updateInventoryRecordInDatabase(dbConnection_InventoryDetails_Database,
                            globalsForServiceModule.inventoryDetails_Table_Name,
                            clientRequestWithParamsMap,
                            globalsForServiceModule.inventoryRecordRequiredFields,
                            http_response);

                        console.log("DesignYourREQuotationWebService.createServer : Successfully placed Update Inventory Record call");

                        break;

                    case "RetrieveInventoryDetails":

                        console.log("DesignYourREQuotationWebService.createServer : Inside Inventory Details Switch : " +
                            "RetrieveInventoryDetails : InventoryName : " + clientRequestWithParamsMap.get("Name"));

                        // DB query & Reponse Building

                        InventoryRecordsQueryModule.retrieveRecordFromInventoryDetailsDatabase(dbConnection_InventoryDetails_Database,
                            globalsForServiceModule.budgetDetails_Table_Name,
                            clientRequestWithParamsMap,
                            InventoryRecordsQueryModule.handleQueryResults,
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

            });

        }

    });

}




