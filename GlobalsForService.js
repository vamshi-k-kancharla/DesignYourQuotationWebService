
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

var userDetails_TableName = "userDetailsCollection";
var inventoryDetails_Table_Name = "inventoryDetailsCollection";
var expenseAggregator_Table_Name = "ExpenseAggregatorCollection";
var expenses_Table_Name = "ExpenseCollection";
var statusTracking_Table_Name = "StatusTrackingCollection";
var companies_Table_Name = "CompaniesCollection";

// Mongo DB Database connections

var mongoDesignYourREQuotationDbUrl = 'mongodb://127.0.0.1:27017/' + designYourREQuotation_Database_Name;
var designYourREQuotationDbConnection;

var backEndDatabase = "MySql"; // Values can be MySql or MongoDB
var mySqlDBConnected = false;

// User Account Creds management & Authorization

var userRegistrationDataRequiredFields = ["CompanyName", "ProjectName", "UserType", "UserId", "UserName", "Email", "Address", "Password"];
var userRegistratonRecordDBColumns = ["CompanyName", "ProjectName", "UserType", "UserId", "UserName", "Email", "Address", "Password"];
var userRegistrationRecordTypes = ["string", "string", "string", "string", "string", "string", "string", "string"];
var userRegistrationDataUniqueFields = ["UserId", "Email"];
var userRegistrationDataNameFields = ["CompanyName", "ProjectName", "UserName"];
var userRecordData_AtleastOneValueShouldBeDifferent = ["UserId", "UserName"];

// Inventory Details : Required Fields

var inventoryRecordRequiredFields = ["Item_Name", "Total_Quantity", "Date_Of_Purchase", "Price_Per_Unit", "Total_Amount", "Used_Quantity" ];
var inventoryRecordDBColumns = ["name", "totalQuantity", "purchaseDate", "PricePerUnit", "TotalAmount", "UsedQuantity"];
var inventoryRecordTypes = ["string", "int", "date", "double", "double", "int"];
var inventoryRecordData_UniqueFields = ["Item_Name"];
var inventoryRecordData_NameFileds = ["Item_Name"];
var inventoryRecordData_AtleastOneValueShouldBeDifferent = ["Item_Name", "Total_Quantity", "Price_Per_Unit", "Date_Of_Purchase", "Total_Amount"];

// Company Details : Required Fields

var companyRecordRequiredFields = ["CompanyName", "ProjectName", "CompanyId", "Email"];
var companyRecordDBColumns = ["CompanyName", "ProjectName", "CompanyId", "Email"];
var companyRecordTypes = ["string", "string", "string", "string"];
var companyRecordData_UniqueFields = ["CompanyName", "CompanyId"];
var companyRecordData_NameFileds = ["CompanyName", "ProjectName"];
var companyRecordData_AtleastOneValueShouldBeDifferent = ["CompanyName", "ProjectName"];

// Status Tracking Details : Required Fields

var statusTrackingRecordRequiredFields = ["CompanyName", "ProjectName", "Location", "StatusDate", "Status", "Photos", "Remarks"];
var statusTrackingRecordDBColumns = ["CompanyName", "ProjectName", "Location", "StatusDate", "Status", "Photos", "Remarks"];
var statusTrackingRecordTypes = ["string", "string", "string", "date", "string", "string", "string"];
var statusTrackingRecordData_UniqueFields = ["CompanyName", "ProjectName"];
var statusTrackingRecordData_NameFileds = ["CompanyName", "ProjectName"];
var statusTrackingRecordData_AtleastOneValueShouldBeDifferent = ["CompanyName", "ProjectName"];

// Expense Details : Required Fields

var expenseRecordRequiredFields = ["CompanyName", "ProjectName", "AggregatorName", "ExpenseName", "ExpenseDate", "Description", "ModeOfPayment", "PaymentAmount"];
var expenseRecordDBColumns = ["CompanyName", "ProjectName", "AggregatorName", "ExpenseName", "ExpenseDate", "Description", "ModeOfPayment", "PaymentAmount"];
var expenseRecordTypes = ["string", "string", "string", "string", "date", "string", "string", "double"];
var expenseRecordData_UniqueFields = ["ExpenseName"];
var expenseRecordData_NameFileds = ["CompanyName", "ProjectName", "AggregatorName", "ExpenseName"];
var expenseRecordData_AtleastOneValueShouldBeDifferent = ["CompanyName", "ProjectName", "AggregatorName", "ExpenseName"];

// Expense Details : Required Fields


var expenseAggregatorRecordRequiredFields = ["ProjectName", "CompanyName", "AggregatorName", "CreatedDate", "TotalAmount", "PaidAmount", "BalanceAmount", "NoOfExpenses"];
var expenseAggregatorRecordDBColumns = ["ProjectName", "CompanyName", "AggregatorName", "CreatedDate", "TotalAmount", "PaidAmount", "BalanceAmount", "NoOfExpenses"];
var expenseAggregatorRecordTypes = ["string", "string", "string", "date", "double", "double", "double", "int"];
var expenseAggregatorRecordData_UniqueFields = ["AggregatorName"];
var expenseAggregatorRecordData_NameFileds = ["AggregatorName", "ProjectName", "CompanyName"];
var expenseAggregatorRecordData_AtleastOneValueShouldBeDifferent = ["AggregatorName", "CreatedDate", "TotalAmount", "PaidAmount", "BalanceAmount"];




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

exports.userDetails_TableName = userDetails_TableName;
exports.inventoryDetails_Table_Name = inventoryDetails_Table_Name;
exports.expenseAggregator_Table_Name = expenseAggregator_Table_Name;
exports.expenses_Table_Name = expenses_Table_Name;
exports.statusTracking_Table_Name = statusTracking_Table_Name;
exports.companies_Table_Name = companies_Table_Name;


exports.mongoDesignYourREQuotationDbUrl = mongoDesignYourREQuotationDbUrl;

exports.backEndDatabase = backEndDatabase; 
exports.mySqlDBConnected = mySqlDBConnected;


exports.userRegistrationDataRequiredFields = userRegistrationDataRequiredFields;
exports.userRegistratonRecordDBColumns = userRegistratonRecordDBColumns;
exports.userRegistrationRecordTypes = userRegistrationRecordTypes;
exports.userRegistrationDataUniqueFields = userRegistrationDataUniqueFields;
exports.userRegistrationDataNameFields = userRegistrationDataNameFields;
exports.userRecordData_AtleastOneValueShouldBeDifferent = userRecordData_AtleastOneValueShouldBeDifferent;


exports.inventoryRecordRequiredFields = inventoryRecordRequiredFields;
exports.inventoryRecordDBColumns = inventoryRecordDBColumns;
exports.inventoryRecordTypes = inventoryRecordTypes;
exports.inventoryRecordData_UniqueFields = inventoryRecordData_UniqueFields;
exports.inventoryRecordData_NameFileds = inventoryRecordData_NameFileds;
exports.inventoryRecordData_AtleastOneValueShouldBeDifferent = inventoryRecordData_AtleastOneValueShouldBeDifferent;


exports.companyRecordRequiredFields = companyRecordRequiredFields;
exports.companyRecordDBColumns = companyRecordDBColumns;
exports.companyRecordTypes = companyRecordTypes;
exports.companyRecordData_UniqueFields = companyRecordData_UniqueFields;
exports.companyRecordData_NameFileds = companyRecordData_NameFileds;
exports.companyRecordData_AtleastOneValueShouldBeDifferent = companyRecordData_AtleastOneValueShouldBeDifferent;


exports.statusTrackingRecordRequiredFields = statusTrackingRecordRequiredFields;
exports.statusTrackingRecordDBColumns = statusTrackingRecordDBColumns;
exports.statusTrackingRecordTypes = statusTrackingRecordTypes;
exports.statusTrackingRecordData_UniqueFields = statusTrackingRecordData_UniqueFields;
exports.statusTrackingRecordData_NameFileds = statusTrackingRecordData_NameFileds;
exports.statusTrackingRecordData_AtleastOneValueShouldBeDifferent = statusTrackingRecordData_AtleastOneValueShouldBeDifferent;


exports.expenseRecordRequiredFields = expenseRecordRequiredFields;
exports.expenseRecordDBColumns = expenseRecordDBColumns;
exports.expenseRecordTypes = expenseRecordTypes;
exports.expenseRecordData_UniqueFields = expenseRecordData_UniqueFields;
exports.expenseRecordData_NameFileds = expenseRecordData_NameFileds;
exports.expenseRecordData_AtleastOneValueShouldBeDifferent = expenseRecordData_AtleastOneValueShouldBeDifferent;


exports.expenseAggregatorRecordRequiredFields = expenseAggregatorRecordRequiredFields;
exports.expenseAggregatorRecordDBColumns = expenseAggregatorRecordDBColumns;
exports.expenseAggregatorRecordTypes = expenseAggregatorRecordTypes;
exports.expenseAggregatorRecordData_UniqueFields = expenseAggregatorRecordData_UniqueFields;
exports.expenseAggregatorRecordData_NameFileds = expenseAggregatorRecordData_NameFileds;
exports.expenseAggregatorRecordData_AtleastOneValueShouldBeDifferent = expenseAggregatorRecordData_AtleastOneValueShouldBeDifferent;

