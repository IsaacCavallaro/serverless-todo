const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const iam = new AWS.IAM();

exports.handler = async (event) => {
    // Extract the table name from the environment variables
    const tableName = process.env.TABLE_NAME;
    
    // Get the function's execution role
    const role = process.env.ROLE_NAME;
    let roleArn;
    if (role) {
      const roleData = await iam.getRole({ RoleName: role }).promise();
      roleArn = roleData.Role.Arn;
    }
    else {
      roleArn = process.env.ROLE_ARN;
    }

    // Add permissions to the role
    await iam.attachRolePolicy({
      PolicyArn: 'arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess',
      RoleName: role
    }).promise();

    // Retrieve all items from the table
    const result = await dynamo.scan({ TableName: tableName }).promise();
    const items = result.Items;

    // Return the items as a response
    return {
        statusCode: 200,
        body: JSON.stringify(items),
    };
};
