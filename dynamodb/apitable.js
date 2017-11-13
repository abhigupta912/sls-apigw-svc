'use strict';

const TableName = "apigwsvc-api";

function ApiTable() {
  this.DocClient = require('./doccl');
};

/**
 * Requires a ctx parameter.
 * Returns a promise which resolves to a ctx with
 * ctx.restApisInDb set.
 */
ApiTable.prototype.getAllApis = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    console.log("Retrieving all apis");

    let params = {
      TableName: TableName
    };

    this.DocClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to retrieve apis");
        reject(err);
      } else {
        let restApis = [];
        data.Items.forEach(item => {
          restApis.push({ apiKey: item.ApiKey, apiExecId: item.ApiId });
        });
        console.log("Found apis: ", restApis);
        ctx.restApisInDb = restApis;
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.apiKeyId set.
 * Returns a promise which resolves to a ctx with
 * ctx.apiExecIds set.
 */
ApiTable.prototype.getApis = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    console.log("Retrieving apis for api key: ", apiKey);

    let params = {
      TableName: TableName,
      KeyConditionExpression: "ApiKey = :apiKey",
      ExpressionAttributeValues: {
        ":apiKey": apiKey
      }
    };

    this.DocClient.query(params, (err, data) => {
      if (err) {
        console.log("Unable to retrieve apis for api key: ", apiKey);
        reject(err);
      } else {
        let apiExecIds = [];
        data.Items.forEach(item => {
          apiExecIds.push(item.ApiId);
        });
        ctx.apiExecIds = apiExecIds;
        console.log("Retrieved apis for api key: ", apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with the following set:
 * ctx.apiKeyId and ctx.apiExecId
 * Returns a promise which resolves to the ctx passed in as request.
 */
ApiTable.prototype.putApi = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    let apiExecId = ctx.apiExecId;
    console.log("Storing rest api: " + apiExecId + " for api key: " + apiKey);

    let params = {
      TableName: TableName,
      Item: {
        ApiKey: apiKey,
        ApiId: apiExecId
      }
    };

    this.DocClient.put(params, (err, data) => {
      if (err) {
        console.log("Unable to store rest api: " + apiExecId + " for api key: " + apiKey);
        reject(err);
      } else {
        console.log("Stored rest api: " + apiExecId + " for api key: " + apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with the following set:
 * ctx.apiKeyId and ctx.apiExecId
 * Returns a promise which resolves to the ctx passed in as request.
 */
ApiTable.prototype.deleteApi = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    let apiExecId = ctx.apiExecId;
    console.log("Deleting rest api: " + apiExecId + " for api key: " + apiKey);

    let params = {
      TableName: TableName,
      Key: {
        ApiKey: apiKey,
        ApiId: apiExecId
      }
    };

    this.DocClient.delete(params, (err, data) => {
      if (err) {
        console.log("Unable to delete rest api: " + apiExecId + " for api key: " + apiKey);
        reject(err);
      } else {
        console.log("Deleted rest api: " + apiExecId + " for api key: " + apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.apiKeyId set.
 * Returns a promise which resolves to the ctx passed in as request.
 */
ApiTable.prototype.deleteApis = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    let apiExecIds = ctx.apiExecIds;
    console.log("Deleting all rest apis for api key: ", apiKey);

    let params = {};
    params["RequestItems"] = {};

    let requestItems = [];
    apiExecIds.forEach(apiId => {
      let deleteRequest = {};
      deleteRequest.DeleteRequest = {};
      deleteRequest.DeleteRequest.Key = {};
      deleteRequest.DeleteRequest.Key.ApiKey = apiKey;
      deleteRequest.DeleteRequest.Key.ApiId = apiId;
      requestItems.push(deleteRequest);
    });

    params.RequestItems[TableName] = requestItems;

    this.DocClient.batchWrite(params, (err, data) => {
      if (err) {
        console.log("Unable to delete all rest apis for api key: ", apiKey);
        reject(err);
      } else {
        console.log("Deleted all rest apis for api key: ", apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

module.exports = ApiTable;

