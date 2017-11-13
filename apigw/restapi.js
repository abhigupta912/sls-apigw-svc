'use strict';

function RestApi() {
  this.APIGateway = require('./apigw');
};

/**
 * Requires a ctx parameter.
 * Returns a promise which resolves to a ctx with
 * ctx.restApis set with all Apis except this one.
 */
RestApi.prototype.getApis = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    console.log("Retrieving rest apis");

    this.APIGateway.getRestApis({}, (err, data) => {
      if (err) {
        console.error("Unable to retrieve rest apis");
        reject(err);
      } else {
        let apis = [];
        data.items.forEach(item => {
          if (!(item.name.endsWith("apigwsvc"))) {
            apis.push({ apiExecId: item.id, apiName: item.name });
          }
        });
        console.log("Found rest apis: ", apis);
        ctx.restApis = apis;
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.restApiSchema set.
 * Returns a promise which resolves to a ctx with
 * ctx.apiExecId and ctx.apiName set.
 */
RestApi.prototype.importApi = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let schema = ctx.restApiSchema;
    console.log("Importing rest api");

    let params = {
      body: JSON.stringify(schema),
      failOnWarnings: true
    };

    this.APIGateway.importRestApi(params, (err, data) => {
      if (err) {
        console.error("Unable to import rest api");
        reject(err);
      } else {
        ctx.apiExecId = data.id;
        ctx.apiName = data.name;
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.apiExecId set.
 * Returns a promise which resolves to the ctx passed in as request.
 */
RestApi.prototype.deleteApi = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiExecId = ctx.apiExecId;
    console.log("Deleting rest api with id: ", apiExecId);

    let params = {
      restApiId: apiExecId
    };

    this.APIGateway.deleteRestApi(params, (err, data) => {
      if (err) {
        console.log("Unable to delete rest api with id: ", apiExecId);
        reject(err);
      } else {
        console.log("Deleted rest api with id: ", apiExecId);
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

module.exports = RestApi;

