'use strict';

const ApiKey = require('../../apigw/apikey');
const ApiTable = require('../../dynamodb/apitable');
const OrgTable = require('../../dynamodb/orgtable');
const RestApi = require('../../apigw/restapi');
const S3 = require('../../s3/s3obj');

module.exports.importApi = (event, context, callback) => {
  let apiKey = new ApiKey();
  let apiTable = new ApiTable();
  let orgTable = new OrgTable();
  let restApi = new RestApi();
  let s3Obj = new S3();

  let ctx = {};
  ctx.restApiSchema = JSON.parse(event.body);
  ctx.apiKeyValue = event.headers["x-api-key"];

  orgTable.getOrgs(ctx)
    .then(ctx => {
      return new Promise((resolve, reject) => {
        let orgsInDb = ctx.orgsInDb;

        orgsInDb.forEach(org => {
          if (org.apiValue == ctx.apiKeyValue) {
            ctx.apiKeyId = org.apiKey;
          }
        });

        resolve(ctx);
      });
    })
    .then(ctx => { return restApi.importApi(ctx); })
    .then(ctx => { return apiTable.putApi(ctx); })
    .then(ctx => {
      return new Promise((resolve, reject) => {
        let restApiSchemaKey = ctx.apiKeyId + "/" + ctx.apiExecId + "/schema";
        ctx.restApiSchemaKey = restApiSchemaKey;
        ctx.s3Key = restApiSchemaKey;
        ctx.s3Value = ctx.restApiSchema;
        resolve(ctx);
      });
    })
    .then(ctx => { return s3Obj.putObject(ctx); })
    .then(ctx => {
      let schemaMeta = {};
      schemaMeta.apiKeyId = ctx.apiKeyId;
      schemaMeta.apiExecId = ctx.apiExecId;
      schemaMeta.schemaKey = ctx.restApiSchemaKey;
      let response = {
        statusCode: 200,
        body: JSON.stringify(schemaMeta)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

