// Get the DynamoDB table name from environment variables
const tableName = process.env.PRICE_REQUEST_TABLE;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * HTTP get method to get one item by id from a DynamoDB table.
 */
exports.getByIdHandler = async (event) => {
  console.log("*********************************** Start Executing - getByIdHandler ********************************************")

  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }

  const investorId = event.pathParameters.id;
  let response = {};

  try {
    const params = {
      TableName : tableName,
      KeyConditionExpression: 'investorId = :investorId',
            ExpressionAttributeValues: {
                ':investorId': investorId
            }
    };

    const data = await docClient.query(params).promise();
   
    response = {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (ResourceNotFoundException) {
    response = {
        statusCode: 404,
        body: "Unable to call DynamoDB. Table resource not found."
    };
  }
 
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  console.log("*********************************** ENDING Executing ********************************************")
  return response;
}
