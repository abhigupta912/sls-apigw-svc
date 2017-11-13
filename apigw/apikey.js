'use strict';

function ApiKey() {
  this.APIGateway = require('./apigw');
};

/**
 * Requires a ctx parameter.
 * Returns a promise which resolves to a ctx with
 * ctx.apiKeys set.
 */
ApiKey.prototype.getKeys = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    console.log("Retrieving all api keys");

    this.APIGateway.getApiKeys({}, (err, data) => {
      if (err) {
        console.error("Unable to retrieve api keys");
        reject(err);
      } else {
        let keys = [];
        console.log(data);
        data.items.forEach(item => {
          keys.push({apiKeyId: item.id, orgName: item.name});
          // keys[item.name] = item.id;
        });
        console.log("Found api keys: ", keys);
        ctx.apiKeys = keys;
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.orgName set.
 * Returns a promise which resolves to a ctx with
 * ctx.apiKeyId and ctx.apiKeyValue set.
 */
ApiKey.prototype.createKey = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let orgName = ctx.orgName;
    console.log("Creating api key for org: ", orgName);

    let params = {
      name: orgName,
      enabled: true
    };

    this.APIGateway.createApiKey(params, (err, data) => {
      if (err) {
        console.error("Unable to create api key for org: ", orgName);
        reject(err);
      } else {
        let keyId = data.id;
        let keyValue = data.value;
        console.log("Created api key with id: " + keyId + " and value: " + keyValue);
        ctx.apiKeyId = keyId;
        ctx.apiKeyValue = keyValue;
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.apiKeyId set.
 * Returns a promise which resolves to the ctx passed in as request.
 */
ApiKey.prototype.deleteKey = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let keyId = ctx.apiKeyId;
    console.log("Deleting api key with id: ", keyId);

    let params = {
      apiKey: keyId
    };

    this.APIGateway.deleteApiKey(params, (err, data) => {
      if (err) {
        console.error("Unable to delete api with id: ", keyId);
        reject(err);
      } else {
        console.log("Deleted api key with id: " + keyId);
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

module.exports = ApiKey;

