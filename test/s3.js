'use strict';

const S3 = require('../s3/s3obj');

module.exports.get = (event, context, callback) => {
  let S3Obj = new S3();

  let ctx = {};
  ctx.s3Key = event.pathParameters.key;

  S3Obj.getObject(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: JSON.stringify(data.s3Value)
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.put = (event, context, callback) => {
  let S3Obj = new S3();

  let ctx = {};
  ctx.s3Key = event.pathParameters.key;
  ctx.s3Value = JSON.parse(event.body);

  S3Obj.putObject(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: "Successfully put object in S3 with key: " + ctx.s3Key
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

module.exports.delete = (event, context, callback) => {
  let S3Obj = new S3();

  let ctx = {};
  ctx.s3Key = event.pathParameters.key;

  S3Obj.deleteObject(ctx)
    .then(data => {
      let response = {
        statusCode: 200,
        body: "Successfully deleted object from S3 with key: " + ctx.s3Key
      };
      callback(null, response);
    })
    .catch(err => {
      console.error(err);
      callback(err.message);
    });
};

