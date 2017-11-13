'use strict';

const TableName = "apigwsvc-org";

function OrgTable() {
  this.DocClient = require('./doccl');
};

/**
 * Requires a ctx parameter.
 * Returns a promise which resolves to a ctx with
 * ctx.orgsInDb set.
 */
OrgTable.prototype.getOrgs = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    console.log("Retrieving all orgs");

    let params = {
      TableName: TableName
    };

    this.DocClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to retrieve orgs");
        reject(err);
      } else {
        let orgs = [];
        data.Items.forEach(item => {
          orgs.push({ apiKey: item.ApiKey, apiValue: item.ApiValue, orgName: item.OrgName, usagePlan: item.UsagePlan });
        });
        console.log("Found org: ", orgs);
        ctx.orgsInDb = orgs;
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
 * ctx.orgName and ctx.usagePlanName set.
 */
OrgTable.prototype.getOrg = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    console.log("Retrieving org for api key: ", apiKey);

    let params = {
      TableName: TableName,
      Key: {
        ApiKey: apiKey
      }
    };

    this.DocClient.get(params, (err, data) => {
      if (err) {
        console.error("Unable to retrieve org for api key: ", apiKey);
        reject(err);
      } else {
        ctx.apiKeyValue = data.Item.ApiValue;
        ctx.orgName = data.Item.OrgName;
        ctx.usagePlanName = data.Item.UsagePlan;
        console.error("Found org for api key: ", apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with the following set:
 * ctx.apiKeyId, ctx.apiValue, ctx.orgName and ctx.usagePlanName
 * Returns a promise which resolves to the ctx passed in as request.
 */
OrgTable.prototype.putOrg = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    let apiValue = ctx.apiKeyValue;
    let orgName = ctx.orgName;
    let usagePlan = ctx.usagePlanName;
    console.log("Storing org: " + orgName + " with api key: " + apiKey + " and usage plan: " + usagePlan);

    let params = {
      TableName: TableName,
      Item: {
        ApiKey: apiKey,
        ApiValue: apiValue,
        OrgName: orgName,
        UsagePlan: usagePlan
      }
    };

    this.DocClient.put(params, (err, data) => {
      if (err) {
        console.error("Unable to store org: " + orgName + " with api key: " + apiKey);
        reject(err);
      } else {
        console.error("Stored org: " + orgName + " with api key: " + apiKey);
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
OrgTable.prototype.deleteOrg = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiKey = ctx.apiKeyId;
    console.log("Deleting org with api key: ", apiKey);

    let params = {
      TableName: TableName,
      Key: {
        ApiKey: apiKey
      }
    };

    this.DocClient.delete(params, (err, data) => {
      if (err) {
        console.log("Unable to delete org with api key: ", apiKey);
        reject(err);
      } else {
        console.log("Deleted org with api key: ", apiKey);
        console.log("Context: ", ctx);
        resolve(ctx);
      };
    });
  });

  return promise;
};

module.exports = OrgTable;

