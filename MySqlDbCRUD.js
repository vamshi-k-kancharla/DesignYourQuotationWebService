
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module Imports & Mongo DB Connection Variables
 * 
*************************************************************************/

var HelperUtilsModule = require('./HelperUtils');

/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Module to handle => Direct CRUD Operations with MongoDB.
 * 
 **************************************************************************
 **************************************************************************
 */


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} document_Object : Document object to be added ( Record, Row in Table )
 * @param {Record} document_ObjectTypes : Document object types of input document Object
 * @param {String} clientRequest : Request from Web Client
 * 
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 *
 */

exports.directQueryAndUpdateRecordsToDatabase = function (dbConnection, collectionName, addRecordsToDBQuery, clientRequest, http_response) {

    // Record Addition

    console.error("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Executing Query => " + addRecordsToDBQuery );

    dbConnection.query(addRecordsToDBQuery, function (err, result) {

        if (err) {
            console.error("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Error while adding/updating the Record to Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Internal Server Error while adding/updating the Record to Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("directQueryAndUpdateRecordsToDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Successfully added/updated the record to the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully added the record to the Collection : " + collectionName;
            HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);
        }

    });

}


/**
 * 
 * @param {DbConnection} dbConnection  : Connection to database 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} document_Object : Document object to be added ( Record, Row in Table )
 * @param {Record} document_ObjectTypes : Document object types of input document Object
 * @param {String} clientRequest : Request from Web Client
 * 
 * @returns {XMLHttpRequestResponse} http_response : HTTP Response to be formulated based on DB operations
 *
 */

exports.directRetrieveRecordsFromDatabase = function (dbConnection, collectionName, retrieveRecordsFromDBQuery,
    clientRequest, http_response, handleQueryResults) {

    // Record Addition

    console.error("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Executing Query => " + addRecordsToDBQuery);

    dbConnection.query(addRecordsToDBQuery, function (err, result) {

        if (err) {
            console.error("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Error while adding/updating the Record to Database collection => " +
                collectionName + " ,Error = " + err);

            if (HelperUtilsModule.valueDefined(http_response)) {

                var failureMessage = "MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Internal Server Error while adding/updating the Record to Database collection => " +
                    collectionName + " , Error = " + err;
                HelperUtilsModule.logInternalServerError("directQueryAndUpdateRecordsToDatabase", failureMessage, http_response);

            }
            return;
        }

        console.log("MySqlDbCRUD.directQueryAndUpdateRecordsToDatabase : Successfully added/updated the record to the Collection : " + collectionName);

        if (HelperUtilsModule.valueDefined(http_response)) {

            var successMessage = "Successfully added the record to the Collection : " + collectionName;
            HelperUtilsModule.buildSuccessResponse_Generic(successMessage, clientRequest, http_response);

            console.log(result);
        }

    });

}

/**
 * 
 * @param {String} collectionName  : Name of Table ( Collection )
 * @param {Record} inputParamsObject : Document object to be added ( Record, Row in Table )
 * @param {Record} inputTypesObject : Data Types of Add Record to be added to Collection / Table
 * @param {Record} inputDBColumnsObject : Column names of Record to be added to Collection / Table
 * @param {Array} requiredDataFields : Required data fields of the current Record To Be added
 * 
 * @returns {String} AddRecordsMySqlQuery : Query for the add records to be added to input collection
 *
 */

exports.getGenericMySqlQueryForRecordAddition = function (collectionName, inputParamsObject, inputTypesObject, inputDBColumnsObject,
requiredDataFields) {

    var addRecordsMySqlQuery = "INSERT INTO " + collectionName + " ( " ;

    var firstColumn = true;

    for( var currentFieldName of requiredDataFields) {

        addRecordsMySqlQuery += ((firstColumn == false) ? " , " : " ") + inputDBColumnsObject[currentFieldName];
        firstColumn = false;
    }

    addRecordsMySqlQuery += " ) " + " VALUES (";

    firstColumn = true;

    for (var currentFieldName of requiredDataFields) {

        var currentValueType = inputTypesObject[currentFieldName];
        var requiredStringNotation = (currentValueType == "date" || currentValueType == "string") ? "'" : " ";

        addRecordsMySqlQuery += ((firstColumn == false) ? " , " : " ") +
            requiredStringNotation + inputParamsObject[currentFieldName] + requiredStringNotation;

        firstColumn = false;
    }

    addRecordsMySqlQuery += " ) ";

    console.log("getGenericMySqlQueryForRecordAddition : Retrieved the mysql query to add records to the database => " +
        addRecordsMySqlQuery);

    return addRecordsMySqlQuery;

}

