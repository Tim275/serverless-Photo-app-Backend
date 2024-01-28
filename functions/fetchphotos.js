const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => { // response to te client
 const result = await dynamoDb.scan({   
    TableName: process.env.PHOTOS_TABLE,
    Limit: 30,
 }) .promise();

    return {
    statusCode: 200,
    body: JSON.stringify({
        result,
    }),  // Convert results to a JSON string
    };  
}