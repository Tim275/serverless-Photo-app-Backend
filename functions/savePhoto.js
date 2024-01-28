const AWS = require("aws-sdk");
const parser = require("lambda-multipart-parser");  // npm install lambda-multipart-parser
const { v4: uuidv4 } = require('uuid'); // npm install uuid
const sharp = require("sharp"); // if the image is to large, (reduce lamda cost !)

const width = 600;


const s3 =  new AWS.S3();
const rekognition = new AWS.Rekognition();
const dynamoDb = new AWS.DynamoDB.DocumentClient();


async function saveFile(file){
   
  const BucketName = process.env.BUCKET_NAME;  // gesetzt in der yaml
  
  const ThumbmailBucket = process.env.THUMBMAIL_BUCKET_NAME; // gesetzt in der yaml
  const thumbmail = await sharp(file.content).resize(width).toBuffer(); // if the image is to large, (reduce lamda cost !)

  
  console.log({file});
  console.log({BucketName});  //test

  
  
   await s3
  .putObject({
    Bucket: ThumbmailBucket,
    Key: file.filename,
    Body: thumbmail,
  })
  .promise(); // rekognition part

  const {Labels} = await rekognition
  .detectLabels({
    Image: {
      Bytes: thumbmail,
    },
  })
  .promise();


const primary_key = uuidv4(); // dynamoDB part
const labels = Labels.map((label) => label.Name);

await dynamoDb.put({
      TableName: process.env.PHOTOS_TABLE,
      Item: {
        primary_key,
        name: file.filename,
        labels,
      }
}).promise();

  return {
    primary_key,
    savedFile: `https://${BucketName}.s3.amazonaws.com/${file.filename}`,
    thumbmail: `https://${ThumbmailBucket}.s3.amazonaws.com/${file.filename}`,
    labels,
  };
  
}

module.exports.handler = async (event) => { // response to te client
  const { files } = await parser.parse(event);
  const filesData = files.map(saveFile);  
  const results = await Promise.all(filesData); 
  
  return {
    statusCode: 200,
    body: JSON.stringify
    (results),  // Convert results to a JSON string
      };
    }