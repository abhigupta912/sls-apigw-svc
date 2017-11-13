'use strict';

const RestApi = require('../apigw/restapi');

module.exports.getApis = (event, context, callback) => {
  let restApi = new RestApi();

  let ctx = {};

  restApi.getApis(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.restApis)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.importApi = (event, context, callback) => {
  let restApi = new RestApi();

  let ctx = {};
  ctx.restApiSchema = JSON.parse(event.body);

  restApi.importApi(ctx)
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
  let restApi = new RestApi();

  let ctx = {};
  ctx.apiExecId = event.pathParameters.id;

  restApi.deleteApi(ctx)
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

