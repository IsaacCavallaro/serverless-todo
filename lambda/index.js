const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    
    const tableName = "todos-table";

    if (event.httpMethod === 'GET') {
        // Retrieve all items from the table
        const result = await dynamo.scan({ TableName: tableName }).promise();
        const items = result.Items;

        // Return the items as a response with CORS headers
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            body: JSON.stringify(items),
        };
    } else if (event.httpMethod === 'POST') {
        // Extract the to-do item from the request body
        console.log("event.body:", event.body);
        const item = JSON.parse(event.body).item;

        console.log("item:", item);

        // Insert the item into the table
        await dynamo.put({
            TableName: tableName,
            Item: item
        }).promise();

        // Return the inserted item as a response with CORS headers
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            body: JSON.stringify(item)
        };
    } else {
        // Return an error for unsupported HTTP methods with CORS headers
        return {
            statusCode: 400,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET,POST"
            },
            body: 'Unsupported HTTP method'
        };
    }
};
