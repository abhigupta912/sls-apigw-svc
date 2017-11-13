'use strict';

const ApiKey = require('../../apigw/apikey');
const ApiTable = require('../../dynamodb/apitable');
const OrgTable = require('../../dynamodb/orgtable');
const RestApi = require('../../apigw/restapi');
const S3 = require('../../s3/s3obj');

module.exports.deleteApi = (event, context, callback) => {
  let apiKey = new ApiKey();
  let apiTable = new ApiTable();
  let orgTable = new OrgTable();
  let restApi = new RestApi();
  let s3Obj = new S3();

  /**
   * 1. passed in the apiExecId
   * 2. use it to get apikeyid from the apitable
   * 3. construct a path for s3
   * 4. delete rest api using apiExecId
   * 5. delete entry in apitable using apikeyid and apiexecid
   * 6. delete schema from s3 using the path in step 3
   */
  let ctx = {};
  ctx.apiExecId = event.pathParameters.id;
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
    .then(ctx => { return apiTable.getApis(ctx); })
    .then(ctx => {
      return new Promise((resolve, reject) => {
        ctx.apiExecIds.forEach(apiExecId => {
          if (ctx.apiExecId == apiExecId) {
            // Authorized to deleteApi - set s3key
            ctx.s3Key = ctx.apiKeyId + "/" + ctx.apiExecId + "/schema";
            resolve(ctx);
          } else {
            reject(new Error("Unauthorised to delete api with id: ", ctx.apiExecId))
          }
        });
      });
    })
    .then(ctx => { return restApi.deleteApi(ctx); })
    .then(ctx => { return apiTable.deleteApi(ctx); })
    .then(ctx => { return s3Obj.deleteObject(ctx); })
    .then(ctx => {
      let schemaMeta = {};
      schemaMeta.apiKeyId = ctx.apiKeyId;
      schemaMeta.apiExecId = ctx.apiExecId;
      schemaMeta.schemaKey = ctx.s3Key;
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

