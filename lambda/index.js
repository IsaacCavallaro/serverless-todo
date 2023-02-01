const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    // Extract the table name from the environment variables
    const tableName = process.env.TABLE_NAME;

    if (event.httpMethod === 'GET') {
        // Retrieve all items from the table
        const result = await dynamo.scan({ TableName: tableName }).promise();
        const items = result.Items;

        // Return the items as a response
        return {
            statusCode: 200,
            body: JSON.stringify(items),
        };
    } else if (event.httpMethod === 'POST') {
        // Extract the to-do item from the request body
        const item = JSON.parse(event.body).item;

        // Generate a unique ID for the item
        const id = Date.now().toString();

        // Insert the item into the table
        await dynamo.put({
            TableName: tableName,
            Item: {
                id: id,
                item: item
            }
        }).promise();

        // Return the inserted item as a response
        return {
            statusCode: 200,
            body: JSON.stringify({
                id: id,
                item: item
            })
        };
    } else {
        // Return an error for unsupported HTTP methods
        return {
            statusCode: 400,
            body: 'Unsupported HTTP method'
        };
    }
};
