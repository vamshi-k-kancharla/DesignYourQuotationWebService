
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * Globals : Module that handles Helper Utils
 * 
 *************************************************************************/

var HelperUtilsModule = require('./HelperUtils');
var GlobalsForServiceModule = require('./GlobalsForService');

var randomNumberSeed = 1000000;

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_StatusCode : Http Status code based on type of Error
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.buildErrorResponse_Generic = function (clientRequest, failureMessage, http_StatusCode, http_Response) {

    // build Error Response and attach it to Http_Response

    var responseObject = null;

    responseObject = { Request: clientRequest, Status: failureMessage };
    var builtResponse = JSON.stringify(responseObject);

    http_Response.writeHead(http_StatusCode, { 'Content-Type': 'application/json' });
    http_Response.end(builtResponse);
}

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.logInternalServerError = function (clientRequest, failureMessage, http_Response) {

    console.error(failureMessage);

    var http_StatusCode = 500;
    HelperUtilsModule.buildErrorResponse_Generic(clientRequest, failureMessage, http_StatusCode, http_Response);
}

/**
 * 
 * @param {any} clientRequest  : Web Client Request
 * @param {any} failureMessage  : Failure Message Error Content
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.logBadHttpRequestError = function (clientRequest, failureMessage, http_Response) {

    console.error(failureMessage);

    var http_StatusCode = 400;
    HelperUtilsModule.buildErrorResponse_Generic(clientRequest, failureMessage, http_StatusCode, http_Response);
}

/**
 * 
 * @param {any} successMessage  : Success Message Content
 * @param {any} webClientRequest  : Client Request Name
 * @param {any} http_Response : Http Response thats gets built
 * 
*/

exports.buildSuccessResponse_Generic = function (successMessage, webClientRequest, http_response) {

    // Build success Response for Client Request

    var responseObject = null;

    responseObject = { Request: webClientRequest, Status: successMessage };
    var genericResponse = JSON.stringify(responseObject);

    http_response.writeHead(200, { 'Content-Type': 'application/json' });
    http_response.end(genericResponse);
}

/**
 * 
 * @param {any} queryResult : query Result from mongo DB
 * 
 * @returns     queryResult_WithoutURLSpaces : queryResult with all values minus URL spaces
 * 
*/

exports.removeUrlSpacesFromObjectValues = function (queryResult) {

    // Modify the Values to remove URL Spaces

    var keys = Object.keys(queryResult);
    var values = Object.values(queryResult);

    for (var i = 0; i < values.length; i++) {

        var currentValue = String(values[i]);

        if (currentValue.includes("object")) {

            continue;
        }

        var regExpr = /%20/gi;
        currentValue = currentValue.replace(regExpr, " ");

        queryResult[keys[i]] = currentValue;
    }

    return queryResult;
}


/**
 * 
 * @param {any} inputMap : any map whose values need to be replaced without url space literals
 * 
 * @returns     inputMap : output Map with all values minus URL spaces
 * 
*/

exports.removeUrlSpacesFromMapValues = function (inputMap) {

    // Modify the Values to remove URL Spaces

    var keys = inputMap.keys();

    for (var currentKey of keys) {

        var currentValue = inputMap.get(currentKey);

        if (HelperUtilsModule.valueDefined(currentValue)) {

            var regExpr = /%20/gi;
            currentValue = currentValue.replace(regExpr, " ");

            inputMap.set(currentKey, currentValue);
        }
    }

    return inputMap;
}


/**
 * 
 * @param {any} inputObject : input Object that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     inputObject : Modified object with "values - "Starting & Trailing" spaces" 
 * 
*/

exports.removeStartingAndTrailingSpacesFromObjectValues = function (inputObject) {

    // Modify the Values to remove URL Spaces

    var keys = Object.keys(inputObject);
    var values = Object.values(inputObject);

    for (var i = 0; i < values.length; i++) {

        var newValueWithoutSpaces = HelperUtilsModule.removeStartingAndTrailingSpacesFromString(values[i]);
        inputObject[keys[i]] = newValueWithoutSpaces;
    }

    return inputObject;
}


/**
 * 
 * @param {any} currentValue : String that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     newValueWithoutSpaces : Modified String with "value - "Starting & Trailing" spaces"
 * 
*/

exports.removeStartingAndTrailingSpacesFromString = function (currentValue) {

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromString => CurrentValue : " + currentValue);
    }

    // Remove Spaces at "Start & End"

    var startPointer = 0;
    var endPointer = 0;

    for (var j = 0; j < currentValue.length; j++) {

        if (currentValue[j] != ' ') {
            startPointer = j;
            break;
        }
    }

    for (var j = currentValue.length - 1; j >= 0; j--) {

        if (currentValue[j] != ' ') {
            endPointer = j;
            break;
        }
    }

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("startPointer : " + startPointer + ", endPointer : " + endPointer);
    }

    var newValueWithoutSpaces = "";

    for (var j = startPointer; j <= endPointer; j++) {

        newValueWithoutSpaces = newValueWithoutSpaces + String(currentValue).substring(j, j + 1);
    }

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromString => newValueWithoutSpaces : " + newValueWithoutSpaces);
    }

    return newValueWithoutSpaces;
}


/**
 * 
 * @param {any} inputMap : input Object that needs cleanup of Starting & Trailing Spaces
 * 
 * @returns     inputMap : Modified object with "values - "Starting & Trailing" spaces"
 * 
*/

exports.removeStartingAndTrailingSpacesFromMapValues = function (inputMap) {

    if (GlobalsForServiceModule.bDebug == true) {

        console.log("removeStartingAndTrailingSpacesFromMapValues of length => " + inputMap.keys().length);
    }

    // Modify the Values to remove URL Spaces

    var keys = inputMap.keys();

    for (var currentKey of keys) {

        var currentValue = inputMap.get(currentKey);

        var newValueWithoutSpaces = HelperUtilsModule.removeStartingAndTrailingSpacesFromString(currentValue);
        inputMap.set(currentKey, newValueWithoutSpaces);
    }

    return inputMap;
}


/**
 * 
 * @param {any} inputValue : Value whose definition needs to be verified
 * 
 * @returns {boolean}  true/false  : True if value is defined, false otherwise
 * 
*/

exports.valueDefined = function (inputValue) {


    if (inputValue == null || inputValue == undefined) {

        return false;
    }

    return true;
}


/**
 * 
 * @param {String} clientRequestCollection  : List of <K,V> pairs from input http_request "k=v" format
 * 
 * @returns {Map} webClientRequestParamsMap  : Map of <K,V> pairs that were obtained from input request
 * 
 */

exports.parseWebClientRequest = function (clientRequestCollection) {

    var webClientRequestParamsMap = new Map();

    console.log("ParseWebClientRequest : ClientRequest Collection =>")
    console.log(clientRequestCollection);

    for (var index = 0; index < clientRequestCollection.length; index++) {

        var currentKeyValuePair = clientRequestCollection[index].split("=");

        webClientRequestParamsMap = webClientRequestParamsMap.set(currentKeyValuePair[0], currentKeyValuePair[1]);
    }

    return webClientRequestParamsMap;
}


/**
 * 
 * @param {Object} inputObject  : Input Object which needs to be converted to Map
 * 
 * @returns {Map} outputMap  : Output Map of <K,V> pairs of input Object
 * 
 */

exports.buildMapFromObject = function (inputObject) {

    var outputMap = new Map();

    for (var currentProperty in inputObject) {

        outputMap.set(currentProperty, inputObject[currentProperty]);
    }

    return outputMap;
}


/**
 * 
 * @param {any} inputValue : Value whose definition needs to be verified
 * 
 * @returns {boolean}  true/false  : True if value is defined, false otherwise
 * 
*/

exports.doesValueExistInArray = function (inputArray, findValue) {

    for (var currentValue of inputArray) {

        if (currentValue == findValue) {

            return true;
        }
    }

    return false;
}

/**
 * 
 * @param {String} inputFloatValue : Value to be checked for floating point number
 * 
 * @returns {boolean}  true/false  : True if value is floating point number, false otherwise
 * 
*/

exports.isFloatingNumber = function (inputFloatValue) {

    if (!HelperUtilsModule.valueDefined(inputFloatValue)) {

        return false;
    }

    var inputFloatValueArray = String(inputFloatValue).split(".");

    if (inputFloatValueArray.length == 2 && Number.isInteger(parseInt(inputFloatValueArray[0])) &&
        Number.isInteger(parseInt(inputFloatValueArray[1]))) {

        return true;
    }

    return false;
}

/**
 * 
 * @param {String} inputValue : Value to be checked for floating point or decimal integer
 * 
 * @returns {boolean}  true/false  : True if inputValue is floating point or  decimal integer, false otherwise
 * 
*/

exports.isNumberOrFloat = function (inputValue) {

    console.log("HelperUtils.isNumberOrFloat => inputValue : " + inputValue);

    if (HelperUtilsModule.valueDefined(inputValue) &&
        (Number.isInteger(parseInt(inputValue)) || HelperUtilsModule.isFloatingNumber(inputValue))) {

        return true;
    }

    return false;
}

/**
 * 
 * @param {String} inputValue : Value to be checked for number
 * 
 * @returns {boolean}  true/false  : True if value is number, false otherwise
 * 
*/

exports.isNumber = function (inputValue) {

    if (!HelperUtilsModule.valueDefined(inputValue)) {

        return false;
    }

    return Number.isInteger(parseInt(inputValue));
}

/**
 * 
 * @param {String} customEncodedInputData : Custom encoded string from Typed_Array_Data of input file at web Client
 * 
 * @returns {Uint8Array}  resultUint8TypedArray  : Uint8 Typed Array derived from Custom Encoded input data
 * 
*/

exports.convertCustomEncodedStringDataToUint8TypedArray = function (customEncodedInputData) {

    console.log("HelperUtils.convertStringDataToUint8TypedArray => customEncodedInputData : " + customEncodedInputData);

    var inputDataBytes = customEncodedInputData.split(",");
    var resultUint8TypedArray = new Uint8Array(inputDataBytes.length);
    var currentPos = 0;

    for (var currentByteStr of inputDataBytes) {

        if (currentPos < 5) {

            console.log("currentByteStr : " + currentByteStr + ", currentByteNumber : " + Number(currentByteStr) );
        }

        resultUint8TypedArray[currentPos++] = Number(currentByteStr);
    }

    return resultUint8TypedArray;
}

/**
 *
 * @param {ArrayBuffer} inputArrayBuffer : Input array buffer to be converted to String
 * 
 * @returns {string} resultStr: Returns string corresponding to input Array Buffer
 *
*/

exports.returnStringFromArrayBuffer = function (inputArrayBuffer) {

    var resultStr = "";
    var currentArrayBufferContent = new Uint8Array(inputArrayBuffer);

    for (var currentByte of currentArrayBufferContent) {

        resultStr += currentByte;
    }

    return resultStr;
}

/**
 *
 * @param {Object} inputObject  : Input Object to be converted to String Display format
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.returnObjectString = function (inputObject) {

    var objectStr = "{";
    var currentPosition = 0;

    for (var currentKey in inputObject) {

        objectStr += currentKey + " : " + inputObject[currentKey];

        if (currentPosition != (Object.keys(inputObject).length - 1)) {

            objectStr += ",";
        }
        ++currentPosition;
    }
    objectStr += "}";

    return objectStr;
}

/**
 *
 * @param {Object} inputObject  : Input Object to be converted to String Display format
 * 
 * @returns {string} objectStr: Returns string corresponding to input object
 *
*/

exports.returnRecursiveObjectString = function (inputObject) {

    for (var currentProperty in inputObject) {

        console.log("==============================================================================");

        if (HelperUtilsModule.valueDefined(inputObject[currentProperty])) {

            if ((typeof inputObject[currentProperty]) == "object") {

                console.log("currentProperty => " + currentProperty + ", currentValue => " + "Object");

            } else {

                console.log("Type => " + (typeof inputObject[currentProperty]));
                console.log("currentProperty => " + currentProperty + ", currentValue => " + inputObject[currentProperty]);
            }
        }

        console.log("==============================================================================");
    }

}

/**
 *
 * @param {Map} inputMap  : Input Map to be converted to String Display format
 * 
 * @returns {string} mapStr: Returns string corresponding to input map
 *
*/

exports.returnMapString = function (inputMap) {

    var mapStr = "{";

    for (var currentKey of inputMap.keys()) {

        mapStr += currentKey + " : " + inputMap.get(currentKey) + ",";
    }
    mapStr += "}";

    return mapStr;
}


/**
 *
 * @param {Array} inputObjectArr : Array of input Objects to be converted to String Display format
 * 
 * @returns {string} objectStr: Returns string corresponding to input object Array
 *
*/

exports.returnStringForArrayOfObjects = function (inputObjectArr) {

    var objectStr = "[";
    var currentPosition = 0;

    for (var currentObject of inputObjectArr) {

        objectStr += HelperUtilsModule.returnObjectString(currentObject);

        if (currentPosition != (inputObjectArr.length - 1)) {

            objectStr += ";";
        }
        ++currentPosition;
    }
    objectStr += "]";

    return objectStr;
}

/**
 * 
 * @returns {string} uniqueIdBasedOnCurrentTime: Returns UniqueId derived out of Current Instance Time
 *                                             : Todo => Doesn't work for multiple concurrent requests at exact instance
 *                                               => Add client's source IP
 *                                               => And also Add Randomly Generated Number
 *                                               => "SourceIP+RandomNumber+CurrentInstance" Id should be good enough for consumer web client
 *
*/

exports.returnUniqueIdBasedOnCurrentTime = function () {

    var todaysDate = new Date();
    var todaysMonth = parseInt(todaysDate.getMonth().toString());
    todaysMonth += 1;
    var todaysYear = parseInt(todaysDate.getYear().toString());
    todaysYear += 1900;
    var randomNumber = Math.floor(Math.random() * randomNumberSeed);

    var uniqueIdBasedOnCurrentTime = randomNumber.toString() + todaysYear + todaysMonth + todaysDate.getDay().toString() +
        todaysDate.getHours().toString() + todaysDate.getMinutes().toString() + todaysDate.getSeconds().toString() +
        todaysDate.getMilliseconds().toString();

    return uniqueIdBasedOnCurrentTime;
}


/**
 *
 * @param {Array} inputArray  : Array of Input elements
 * @param {Number/Character/String} element  : Element to be added if not found
 *
 * @returns {Array} inputArray: Returns array with input element addition if not found
 *
*/

exports.addIfNotFound = function (inputArray, element) {

    for (var currentElement of inputArray) {

        if (currentElement == element) {

            return inputArray;
        }
    }

    inputArray.push(element);
    return inputArray;
}

/**
 *
 * @param {String} inputStrValue  : Input string to be built
 * @param {Number} minReqTokens  : Minimum no of tokens required
 *
 * @returns {String} inputStrValue: Returns String with min Required tokens
 *
*/

exports.buildInputStrWithMinReqTokens = function (inputStrValue, minReqTokens) {

    var tokenArray = String(inputStrValue).split(" ");

    if (!HelperUtilsModule.valueDefined(inputStrValue)) {

        return null;
    }

    if (tokenArray.length >= minReqTokens) {

        return inputStrValue;
    }

    for (var currentIndex = 0; String(inputStrValue).split(" ").length < minReqTokens; currentIndex++) {

        if (currentIndex == tokenArray.length) {

            currentIndex = 0;
        }

        inputStrValue += " ";
        inputStrValue += tokenArray[currentIndex];
    }

    return inputStrValue;
}



