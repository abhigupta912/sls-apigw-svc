'use strict';

function UsagePlan() {
  this.APIGateway = require('./apigw');
};

/**
 * Requires a ctx parameter.
 * Returns a promise which resolves to a ctx with
 * ctx.usagePlans set with all relevant usage plans.
 */
UsagePlan.prototype.getPlans = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    console.log("Retrieving relevant usage plans");

    this.APIGateway.getUsagePlans({}, (err, data) => {
      if (err) {
        console.error("Unable to retrieve usage plans");
        reject(err);
      } else {
        let plans = {};
        data.items.forEach(item => {
          if (item.name.endsWith("Use")) {
            plans[item.name] = item.id;
          }
        });
        console.log("Found usage plans: ", plans);
        ctx.usagePlans = plans;
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with the following set:
 * ctx.apiKeyId, ctx.usagePlanName and ctx.usagePlans
 * Returns a promise which resolves to the ctx passed in as request.
 */
UsagePlan.prototype.addKeyToPlan = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let keyId = ctx.apiKeyId;
    let planName = ctx.usagePlanName;
    let plans = ctx.usagePlans;

    console.log("Adding api key: " + keyId + " to usage plan: " + planName);

    if (!(plans.hasOwnProperty(planName))) {
      reject(new Error("Invalid plan name: " + planName));
    }

    let planId = plans[planName];
    console.log("Corresponding planId: ", planId);

    let params = {
      keyId: keyId,
      keyType: "API_KEY",
      usagePlanId: planId
    };

    this.APIGateway.createUsagePlanKey(params, (err, data) => {
      if (err) {
        console.error("Unable to add api key: " + keyId + " to usage plan: " + planName);
        reject(err);
      } else {
        console.log("Added api key: " + keyId + " to usage plan: " + planName);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with the following set:
 * ctx.apiKeyId, ctx.usagePlanName and ctx.usagePlans
 * Returns a promise which resolves to the ctx passed in as request.
 */
UsagePlan.prototype.removeKeyFromPlan = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let keyId = ctx.apiKeyId;
    let planName = ctx.usagePlanName;
    let plans = ctx.usagePlans;

    console.log("Removing api key: " + keyId + " from usage plan: " + planName);

    if (!(plans.hasOwnProperty(planName))) {
      reject(new Error("Invalid plan name: " + planName));
    }

    let planId = plans[planName];
    console.log("Corresponding planId: ", planId);

    let params = {
      keyId: keyId,
      usagePlanId: planId
    };

    this.APIGateway.deleteUsagePlanKey(params, (err, data) => {
      if (err) {
        console.error("Unable to remove api key: " + keyId + " from usage plan: " + planName);
        reject(err);
      } else {
        console.log("Removed api key: " + keyId + " from usage plan: " + planName);
        resolve(ctx);
      }
    });
  });

  return promise;
};

module.exports = UsagePlan;

