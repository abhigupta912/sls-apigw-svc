'use strict';

const ApiKey = require('../apigw/apikey');

module.exports.getKeys = (event, context, callback) => {
  let apiKey = new ApiKey();

  let ctx = {};

  apiKey.getKeys(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.apiKeys)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.create = (event, context, callback) => {
  let apiKey = new ApiKey();

  let ctx = {};
  ctx.orgName = event.pathParameters.id;

  apiKey.createKey(ctx)
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

module.exports.delete = (event, context, callback) => {
  let apiKey = new ApiKey();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.id;

  apiKey.deleteKey(ctx)
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

