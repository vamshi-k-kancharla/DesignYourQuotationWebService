
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * Copy Rights Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * User Authentication Module
 * 
 **************************************************************************
 **************************************************************************
 */


/*************************************************************************
 * 
 * Globals : Module Imports & Mongo DB Connection Variables
 * 
*************************************************************************/

//var randomSeed_ForPasswordHash = "RandomHashSeed";

var cryptoModule = require('crypto');
var HelperUtilsModule = require('./HelperUtils');
var InventoryRecordsQueryAndUpdateModule = require('./InventoryRecordsQueryAndUpdates');

/**
 * 
 * @param {Map} recordObjectMap  : Map of <K,V> Pairs from Client Request
 * 
 * @returns {Object} credentialsObject  : Prepare and return User Credentials Object
 *
 */

function prepareUserCredentialsObject (recordObjectMap) {


    // Replace the "URL Space" with regular space in Record Object Map Values

    recordObjectMap = HelperUtilsModule.removeUrlSpacesFromMapValues(recordObjectMap);

    // Remove "Starting & Trailing Spaces" from Record Object Map Values

    recordObjectMap = HelperUtilsModule.removeStartingAndTrailingSpacesFromMapValues(recordObjectMap);

    // Prepare User Registration Object for MongoDB consumption

    var credentailsDataObject = new Object();

    credentailsDataObject.UserId = recordObjectMap.get("UserId");
    credentailsDataObject.Password = recordObjectMap.get("Password");
    credentailsDataObject.PasswordEncrypted = recordObjectMap.get("PasswordEncrypted");

    return credentailsDataObject;
}

/**
 * 
 * @param {any} dbConnection  : Connection to database 
 * @param {any} collectionName  : Name of Table ( Collection )
 * @param {any} document_Object : Document object to be added ( Record, Row in Table )
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.validateUserCredentials = function (dbConnection, collectionName, recordObjectMap, http_Response) {

    var userAuthenticationResponseObject = null;

    // Prepare Credentials Data Object

    var credentailsDataObject = prepareUserCredentialsObject(recordObjectMap);
    var document_Object = credentailsDataObject;

    // Check if the request has UserName & Password Details

    if (!HelperUtilsModule.valueDefined(document_Object.UserId) ||
        !HelperUtilsModule.valueDefined(document_Object.Password) ) {

        console.log("validateUserCredentials : Missing credential Details ( UserId || Password )");
        var failureMessage = "Failure: Blank UserName || Password in input Request";

        buildErrorResponse_ForUserAuthentication(failureMessage, http_Response);
        return;
    }

    // DB Query

    console.log("retrieveRecordFromInventoryDetailsDatabase => collectionName :" + collectionName);

    var retrieveUserRecordFromDBQuery = getMySqlQueryForUserRecordRetrieval(collectionName, document_Object.UserId);
    console.log("retrieveUserRecordFromDBQuery => query :" + retrieveUserRecordFromDBQuery);

    // Validate Credentials and Build Response

    dbConnection.query(retrieveUserRecordFromDBQuery, function (err, result) {

        if (err) {

            console.error("UserAuthentication.validateUserCredentials : Internal Server Error while querying DB for User Credentials" + err);

            var failureMessage = "UserAuthentication.validateUserCredentials : Internal Server Error while querying DB for User Credentials";
            HelperUtilsModule.logInternalServerError("validateUserCredentials", failureMessage, http_Response);

            return;
        }

        var recordPresent = (result) ? "true" : "false";

        // Check for the presence of User Record

        if (recordPresent == "false") {

            console.log("validateUserCredentials : UserId was not registered : " + document_Object.UserId);
            var failureMessage = "validateUserCredentials : UserId was not registered : " + document_Object.UserId;

            buildErrorResponse_ForUserAuthentication(failureMessage, http_Response);

        } else {

            // User Exists. Validate the Password

            console.log("validateUserCredentials : User Exists. Validate the Credentials for User : " + document_Object.UserId);

            var inputPasswordHash = null;

            console.log("validateUserCredentials : PasswordEncrypted : " + document_Object.PasswordEncrypted);

            // Check if Password has already been Encrypted

            if (document_Object.PasswordEncrypted == "True" || document_Object.PasswordEncrypted == "true") {

                inputPasswordHash = document_Object.Password;

            } else {

                inputPasswordHash = cryptoModule.createHash('md5').update(document_Object.Password).digest('hex');
            }

            // Password comparison 

            console.log("string result : " + JSON.stringify(result));
            console.log("string result[0] : " + JSON.stringify(result[0]));
            console.log("string result[0].UserId : " + result[0]["UserId"]);

            for (var property in result[0]) {

                console.log("Property : " + property + " , value = " + result[0][property]);
            }

            if (result[0].Password != inputPasswordHash) {

                console.log("validateUserCredentials : Passwords did not Match for User : " + document_Object.UserId);
                var failureMessage = "validateUserCredentials : Passwords did not Match for UserId : " + document_Object.UserId;

                buildErrorResponse_ForUserAuthentication(failureMessage, http_Response);

            } else {

                http_Response.writeHead(200, { 'Content-Type': 'application/json' });

                userAuthenticationResponseObject = { Request: "UserAuthentication", Status: "Authentication Successful" };
                var userAuthenticationResponse = JSON.stringify(userAuthenticationResponseObject);

                http_Response.end(userAuthenticationResponse);
            }
        }

    });

}


/**
 * 
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

function buildErrorResponse_ForUserAuthentication(failureMessage, http_Response) {

    // Check if the request has UserName & Password Details

    var userCredsValidationResponseObject = null;

    userCredsValidationResponseObject = { Request: "UserAuthentication", Status: failureMessage };
    var userAuthenticationResponse = JSON.stringify(userCredsValidationResponseObject);

    http_Response.writeHead(400, { 'Content-Type': 'application/json' });
    http_Response.end(userAuthenticationResponse);
}



/**
 * 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} inputUserId : UserId of the record to be retrieved and validated against
 * 
 * @returns {String} recordRetrievalMySqlQuery : Query for Retrieval of User Record from given collection
 *
 */

function getMySqlQueryForUserRecordRetrieval(collectionName, inputUserId) {

    var recordRetrievalMySqlQuery = "SELECT * From " + collectionName + " WHERE UserId = '" + inputUserId + "'";


    console.log("getMySqlQueryForUserRecordRetrieval : Retrieved the mysql query to retrieve records from the database => " +
        recordRetrievalMySqlQuery);

    return recordRetrievalMySqlQuery;

}


