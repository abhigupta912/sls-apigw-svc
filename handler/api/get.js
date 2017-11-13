'use strict';

const ApiKey = require('../../apigw/apikey');
const ApiTable = require('../../dynamodb/apitable');
const OrgTable = require('../../dynamodb/orgtable');
const RestApi = require('../../apigw/restapi');
const S3 = require('../../s3/s3obj');

function getAllApis(ctx) {
  let promise = new Promise((resolve, reject) => {
    let apiTable = new ApiTable();
    let orgTable = new OrgTable();
    let restApi = new RestApi();

    orgTable.getOrgs(ctx)
      .then(ctx => { return apiTable.getAllApis(ctx); })
      .then(ctx => { return restApi.getApis(ctx); })
      .then(ctx => {
        let keyIdToOrgNameMap = {};
        let apiExecIdToKeyIdMap = {};
        let restApiList = [];

        ctx.orgsInDb.forEach(orgData => {
          keyIdToOrgNameMap[orgData.apiKey] = orgData.orgName;
        });

        ctx.restApisInDb.forEach(restApi => {
          apiExecIdToKeyIdMap[restApi.apiExecId] = restApi.apiKey;
        });

        ctx.restApis.forEach(restApi => {
          let apiExecId = restApi.apiExecId;
          let apiName = restApi.apiName;
          let apiKeyId = apiExecIdToKeyIdMap[apiExecId];
          let orgName = keyIdToOrgNameMap[apiKeyId];
          restApiList.push({ apiExecId: apiExecId, apiName: apiName, apiKeyId: apiKeyId, orgName: orgName });
        });

        ctx.restApisMeta = restApiList;
        resolve(ctx);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      });
  });

  return promise;
};

module.exports.getApis = (event, context, callback) => {
  let apiTable = new ApiTable();
  let orgTable = new OrgTable();
  let restApi = new RestApi();

  let ctx = {};

  getAllApis(ctx)
    .then(ctx => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(ctx.restApisMeta)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.getApi = (event, context, callback) => {
  let apiTable = new ApiTable();
  let orgTable = new OrgTable();
  let restApi = new RestApi();

  let ctx = {};
  ctx.apiExecId = event.pathParameters.id;

  getAllApis(ctx)
    .then(ctx => {
      let restApiMeta = {};

      ctx.restApisMeta.forEach(apiMeta => {
        if (apiMeta.apiExecId == ctx.apiExecId) {
          restApiMeta = apiMeta;
        }
      });

      let response = {
        statusCode: 200,
        body: JSON.stringify(restApiMeta)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.getSchema = (event, context, callback) => {
  let apiTable = new ApiTable();
  let orgTable = new OrgTable();
  let restApi = new RestApi();
  let s3Obj = new S3();

  let ctx = {};
  ctx.apiExecId = event.pathParameters.id;

  apiTable.getAllApis(ctx)
    .then(ctx => {
      return new Promise((resolve, reject) => {
        let s3Key = "";

        ctx.restApisInDb.forEach(restApi => {
          if (restApi.apiExecId == ctx.apiExecId) {
            s3Key = restApi.apiKey + "/" + restApi.apiExecId + "/schema";
          }
        });

        ctx.s3Key = s3Key;
        resolve(ctx);
      });
    })
    .then(ctx => { return s3Obj.getObject(ctx); })
    .then(ctx => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(ctx.s3Value)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

