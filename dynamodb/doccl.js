'use strict';

const AWS = require('aws-sdk');
const DocClient = new AWS.DynamoDB.DocumentClient();

module.exports = DocClient;

