
/**************************************************************************************
 * 
 * 
 * Web Service to upload Files for Design Your Life Service using Express Framework 
 * 
 * 
 **************************************************************************************/

'use strict';

var port = process.env.PORT || 4501;

/*************************************************************************
 * 
 * Globals : Module Imports & Http Global Variables
 * 
 *************************************************************************/

// Generic Variables Global

var express = require('express');
var application = express();

var multer = require('multer');
var uploadFiles = multer({ dest: "./../ UploadedExpenseFiles/"})


/**************************************************************************
 **************************************************************************
 * 
 *  Main Service Module : DesignYourLife FileUploadService Web Service
 *  
 *  Start DesignYourLife FileUploadService Web Server and upload files from web client
 *
 **************************************************************************
 **************************************************************************
 */

/**
 * 
 * @param {XMLHttpRequest} http_request  : HTTP Request from Web Client
 * 
 * @returns {HTTpResponse} http_response  : http_response to be returned to Client with respective http_status
 * 
*/

application.get('/', function (http_request, http_response) {

    console.log("Parsing http_request from Client");
    console.log("http_request.url : " + http_request.url);

    // Return unexpected urls

    if (http_request.url == null || http_request.url == "/favicon.ico") {

        console.log("unexpected http_request.url : " + http_request.url);
        return;
    }

    console.log("==============================================================================");
    console.log("http_request.file : " + http_request.file);
    console.log("==============================================================================");

    console.log("==============================================================================");

    console.log("http_request.body : " + http_request.end);
    console.log("http_request.body.type : " + (typeof http_request.end));

    console.log("==============================================================================");



}).listen(globalsForServiceModule.port);

