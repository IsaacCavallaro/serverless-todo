const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Extract the table name from the environment variables
    const tableName = process.env.TABLE_NAME;

    // Retrieve all items from the table
    const result = await dynamo.scan({ TableName: tableName }).promise();
    const items = result.Items;

    // Return the items as a response
    return {
        statusCode: 200,
        body: JSON.stringify(items),
    };
};
