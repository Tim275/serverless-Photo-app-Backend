const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const sendResponse = require("../utils/sendResponse"); // adjust the path according to your project structure

module.exports.handler = async (event) => { // response to the client
  
    console.log(event);

    const queryStringParameters = event.queryStringParameters || {};
    const {limit, startKey} = queryStringParameters;
    const ExclusiveStartKey = startKey ? { primary_key: startKey } : undefined;
    const result = await dynamoDb.scan({   
        TableName: process.env.PHOTOS_TABLE,
        Limit: limit || 10,
        ...(ExclusiveStartKey ? {ExclusiveStartKey} : {}),
    }).promise();

    return sendResponse({
        statusCode: 200,
        body: result,
    });
};