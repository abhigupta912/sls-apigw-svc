'use strict';

const ApiKey = require('../apigw/apikey');
const UsagePlan = require('../apigw/usageplan');
const OrgTable = require('../dynamodb/orgtable');

module.exports.register = (event, context, callback) => {
  let apiKey = new ApiKey();
  let usagePlan = new UsagePlan();
  let orgTable = new OrgTable();

  let ctx = {};
  ctx.orgName = event.pathParameters.orgName;
  ctx.usagePlanName = event.queryStringParameters.planName;

  usagePlan.getPlans(ctx)
    .then(ctx => { return apiKey.createKey(ctx); })
    .then(ctx => { return usagePlan.addKeyToPlan(ctx); })
    .then(ctx => { return orgTable.putOrg(ctx); })
    .then(ctx => {
      let orgMetadata = {
        orgName: ctx.orgName,
        usagePlan: ctx.usagePlanName,
        apiKey: ctx.apiKeyId,
        apiValue: ctx.apiKeyValue
      };
      let response = {
        statusCode: 200,
        body: JSON.stringify(orgMetadata)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

