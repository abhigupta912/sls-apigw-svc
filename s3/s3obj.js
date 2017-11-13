'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const bucketName = "apigwsvc";

function S3Obj() { };

/**
 * Requires a ctx parameter with ctx.s3Key set.
 * Returns a promise which resolves to a ctx with
 * corresponding ctx.s3Value set.
 */
S3Obj.prototype.getObject = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let key = ctx.s3Key;
    console.log("Retrieving object with key: " + key + " from bucket: " + bucketName);

    let params = {
      Bucket: bucketName,
      Key: key
    };

    S3.getObject(params, (err, data) => {
      if (err) {
        console.log("Unable to retrieve object with key: " + key + " from bucket: " + bucketName);
        reject(err);
      } else {
        console.log("Retrieved object with key: " + key + " from bucket: " + bucketName);
        ctx.s3Value = JSON.parse(data.Body.toString());
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.s3Key and ctx.s3Value set.
 * Returns a promise which resolves to the ctx passed in as request.
 */
S3Obj.prototype.putObject = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let key = ctx.s3Key;
    let value = ctx.s3Value;
    console.log("Storing object with key: " + key + " in bucket: " + bucketName);

    let params = {
      Bucket: bucketName,
      Key: key,
      ContentType: 'application/json',
      Body: JSON.stringify(value)
    };

    S3.putObject(params, (err, data) => {
      if (err) {
        console.log("Unable to store object with key: " + key + " in bucket: " + bucketName);
        reject(err);
      } else {
        console.log("Stored object with key: " + key + " in bucket: " + bucketName);
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

/**
 * Requires a ctx parameter with ctx.s3Key set.
 * Returns a promise which resolves to the ctx passed in as request.
 */
S3Obj.prototype.deleteObject = function (ctx) {
  let promise = new Promise((resolve, reject) => {
    let key = ctx.s3Key;
    console.log("Deleting object with key: " + key + " from bucket: " + bucketName);

    let params = {
      Bucket: bucketName,
      Key: key
    };

    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log("Unable to delete object with key: " + key + " from bucket: " + bucketName);
        reject(err);
      } else {
        console.log("Deleted object with key: " + key + " from bucket: " + bucketName);
        console.log("Context: ", ctx);
        resolve(ctx);
      }
    });
  });

  return promise;
};

module.exports = S3Obj;

