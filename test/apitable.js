'use strict';

const ApiTable = require('../dynamodb/apitable');

module.exports.getAllApis = (event, context, callback) => {
  let apiTable = new ApiTable();

  let ctx = {};

  apiTable.getAllApis(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.restApisInDb)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.getApis = (event, context, callback) => {
  let apiTable = new ApiTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.apiKeyId;

  apiTable.getApis(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.apiExecIds)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.putApi = (event, context, callback) => {
  let apiTable = new ApiTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.apiKeyId;
  ctx.apiExecId = event.pathParameters.apiExecId;

  apiTable.putApi(ctx)
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

module.exports.deleteApi = (event, context, callback) => {
  let apiTable = new ApiTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.apiKeyId;
  ctx.apiExecId = event.pathParameters.apiExecId;

  apiTable.deleteApi(ctx)
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

module.exports.deleteApis = (event, context, callback) => {
  let apiTable = new ApiTable();

  let ctx = {};
  ctx.apiKeyId = event.pathParameters.apiKeyId;
  ctx.apiExecIds = JSON.parse(event.body);

  apiTable.deleteApis(ctx)
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

