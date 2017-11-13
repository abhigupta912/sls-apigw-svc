'use strict';

const OrgTable = require('../dynamodb/orgtable');

module.exports.getOrgs = (event, context, callback) => {
  let orgTable = new OrgTable();

  let ctx = {};

  orgTable.getOrgs(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.orgsInDb)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.getOrg = (event, context, callback) => {
  let orgTable = new OrgTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.id;

  orgTable.getOrg(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.putOrg = (event, context, callback) => {
  let orgTable = new OrgTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.id;
  ctx.apiKeyValue = event.queryStringParameters.apiValue;
  ctx.orgName = event.queryStringParameters.orgName;
  ctx.usagePlanName = event.queryStringParameters.planName;

  orgTable.putOrg(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.deleteOrg = (event, context, callback) => {
  let orgTable = new OrgTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.id;

  orgTable.deleteOrg(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

