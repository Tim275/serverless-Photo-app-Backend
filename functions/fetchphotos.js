const AWS = require("aws-sdk");
const formatPhotoResponse = require("../utils/formatPhotoResponse"); // adjust the path according to your project structure 
const sendResponse = require("../utils/sendResponse"); // adjust the path according to your project structure
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const fetchWithFilter = require("./utils/fetchWithfilter");

module.exports.handler = async (event) => {
    
    const {limit, startKey, label} = event.queryStringParameters || {};
    const ExclusiveStartKey = startKey ? { primary_key: startKey } : undefined;

    const results = await fetchWithFilter({
        TableName: process.env.PHOTOS_TABLE,
        Limit: limit || 10,
        ...(startKey ? { ExclusiveStartKey } : {}),
        ...(label ? { FilterExpression: "contains (labels, :label)", ExpressionAttributeValues: { ":label": label } } : {}),
    });

    console.log(results); // Moved this line here

    return sendResponse(200, {
        items: formatPhotoResponse(results.items),
        lastKey: results.lastKey,
    });
};