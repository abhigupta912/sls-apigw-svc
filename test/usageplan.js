'use strict';

const UsagePlan = require('../apigw/usageplan');

module.exports.getPlans = (event, context, callback) => {
  let usagePlan = new UsagePlan();

  let ctx = {};

  usagePlan.getPlans(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.usagePlans)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.addKey = (event, context, callback) => {
  let usagePlan = new UsagePlan();

  let ctx = {};
  ctx.usagePlanName = event.pathParameters.planName;
  ctx.apiKeyId = event.pathParameters.keyId;
  ctx.usagePlans = JSON.parse(event.body);

  usagePlan.addKeyToPlan(ctx)
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

module.exports.removeKey = (event, context, callback) => {
  let usagePlan = new UsagePlan();

  let ctx = {};
  ctx.usagePlanName = event.pathParameters.planName;
  ctx.apiKeyId = event.pathParameters.keyId;
  ctx.usagePlans = JSON.parse(event.body);

  usagePlan.removeKeyFromPlan(ctx)
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

