// Import required libraries 
const crypto = require('crypto');

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.PRICE_REQUEST_TABLE;

/**
 * HTTP post method to add one item to a DynamoDB table.
 */
exports.putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }

    const body = JSON.parse(event.body);
    const UUID = crypto.randomUUID()
    const investorId = body.investorId;
    const email = body.email;
    const cryptocurrency = body.cryptocurrency
    const time = JSON.stringify(new Date())

    let response = {};

    try {
        const params = {
            TableName : tableName,
            Item: { investorId: investorId, email: email, cryptocurrency: cryptocurrency, time: time, UUID:UUID }
        };
    
        const result = await docClient.put(params).promise();
        body.info = "An email will be sent with the details. Thank you!"

        response = {
            statusCode: 200,
            body: JSON.stringify(body)
        };
    } catch (ResourceNotFoundException) {
        response = {
            statusCode: 404,
            body: "Unable to call DynamoDB. Table resource not found."
        };
    }

    // To CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
