import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';


export class TodoStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DynamoDB Table
        const table = new dynamodb.Table(this, 'todos-table', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.NUMBER },
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });

        new cdk.CfnOutput(this, 'tableName', { value: table.tableName });

        const role = new iam.Role(this, 'DynamoDBFunctionRole', {
          assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
          managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonDynamoDBFullAccess')],
        });
        
        const todoFunction = new lambda.Function(this, 'todoFunction', {
          runtime: lambda.Runtime.NODEJS_16_X,
          code: lambda.Code.fromAsset('lambda'),
          handler: 'index.handler',
          environment: {
            TABLE_NAME: table.tableName
          },
          role: role
        });

        // Give the Lambda function permissions to access the DynamoDB table
        table.grantReadWriteData(todoFunction);

        new cdk.CfnOutput(this, 'functionArn', { value: todoFunction.functionArn });
    }
}
