
/*************************************************************************
 * 
 * Author : Vamshi Krishna Kancharla
 * CopyRight Holder : ThinkTalk Software Solutions Pvt Ltd
 * 
 *************************************************************************/

'use strict';

/*************************************************************************
 * 
 * GlobalsForService : Module that handles Globals for Flow Control
 * 
**************************************************************************/

// Globals for retrieving the Seller bank

var periodicPollingInterval_DisjointDatabase = 5000;

// Define globals as per JSPDF Inclusion Usage/Syntax

var port = process.env.PORT || 4500;

// MongoDB Connection Variables

var mongoDbConnection = require('mongodb');
var mongoClient = mongoDbConnection.MongoClient;

// Single Database for all "DesignYourREQuotation" needs

var designYourREQuotation_Database_Name = "designYourREQuotationDb";

// All Table/Collection Names

var budgetDetails_Table_Name = "budgetDetailsCollection";
var userDetails_TableName = "designYourREQuotationUserDetailsCollection";
var inventoryDetails_Table_Name = "inventoryDetailsCollection";

// Mongo DB Database connections

var mongoDesignYourREQuotationDbUrl = 'mongodb://127.0.0.1:27017/' + designYourREQuotation_Database_Name;
var designYourREQuotationDbConnection;

var backEndDatabase = "MySql"; // Values can be MySql or MongoDB

// Budget Details : Required Fields

var budgetRecordRequiredFields = ["Budget_Id", "BudgetName", "Budget_Type", "Place", "StartDate", "EndDate", "Amount", "UserName"];
var budgetRecordData_UniqueFields = ["Budget_Id"];
var budgetRecordData_NameFileds = ["BudgetName", "UserName"];
var budgetRecordData_SubGroupFileds = ["Budget_Type", "Place", "StartDate", "EndDate"];
var budgetRecordData_AtleastOneValueShouldBeDifferent = ["BudgetName", "UserName","Budget_Type", "Place", "StartDate", "EndDate"];

// User Account Creds management & Authorization

var userRegistrationData_RequiredFields = ["UserType", "User_Id", "Name", "Email", "Address", "UserName", "Password"];
var userRegistrationData_UniqueFields = ["User_Id", "Email", "UserName"];

// Inventory Details : Required Fields

var inventoryRecordRequiredFields = ["Item_Name", "Total_Quantity", "Date_Of_Purchase", "Price_Per_Unit", "Total_Amount", "Used_Quantity" ];
var inventoryRecordDBColumns = ["name", "totalQuantity", "purchaseDate", "PricePerUnit", "TotalAmount", "UsedQuantity"];
var inventoryRecordTypes = ["string", "int", "date", "double", "double", "int"];
var inventoryRecordData_UniqueFields = ["Item_Name"];
var inventoryRecordData_NameFileds = ["Item_Name"];
var inventoryRecordData_AtleastOneValueShouldBeDifferent = ["Item_Name", "Total_Quantity", "Price_Per_Unit", "Date_Of_Purchase", "Total_Amount"];



// Global variables

var bDebug = false;


/**************************************************************************
 **************************************************************************
 **************************************************************************
 * 
 * Export the Globals
 * 
 **************************************************************************
 **************************************************************************
 */

exports.bDebug = bDebug;

exports.designYourREQuotationDbConnection = designYourREQuotationDbConnection;

exports.periodicPollingInterval_DisjointDatabase = periodicPollingInterval_DisjointDatabase;
exports.port = port;
exports.mongoDbConnection = mongoDbConnection;
exports.mongoClient = mongoClient;

exports.designYourREQuotation_Database_Name = designYourREQuotation_Database_Name;

exports.budgetDetails_Table_Name = budgetDetails_Table_Name;
exports.userDetails_TableName = userDetails_TableName;
exports.inventoryDetails_Table_Name = inventoryDetails_Table_Name;

exports.mongoDesignYourREQuotationDbUrl = mongoDesignYourREQuotationDbUrl;

exports.backEndDatabase = backEndDatabase;


exports.userRegistrationData_RequiredFields = userRegistrationData_RequiredFields;
exports.userRegistrationData_UniqueFields = userRegistrationData_UniqueFields;


exports.budgetRecordRequiredFields = budgetRecordRequiredFields;
exports.budgetRecordData_UniqueFields = budgetRecordData_UniqueFields;
exports.budgetRecordData_NameFileds = budgetRecordData_NameFileds;
exports.budgetRecordData_SubGroupFileds = budgetRecordData_SubGroupFileds;
exports.budgetRecordData_AtleastOneValueShouldBeDifferent = budgetRecordData_AtleastOneValueShouldBeDifferent;

exports.inventoryRecordRequiredFields = inventoryRecordRequiredFields;
exports.inventoryRecordDBColumns = inventoryRecordDBColumns;
exports.inventoryRecordTypes = inventoryRecordTypes;
exports.inventoryRecordData_UniqueFields = inventoryRecordData_UniqueFields;
exports.inventoryRecordData_NameFileds = inventoryRecordData_NameFileds;
exports.inventoryRecordData_AtleastOneValueShouldBeDifferent = inventoryRecordData_AtleastOneValueShouldBeDifferent;


