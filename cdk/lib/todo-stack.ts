import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class TodoStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // DynamoDB Table
        const table = dynamodb.Table.fromTableName(this, 'todos-table', 'todos-table');

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
            role: role,
            logRetention: logs.RetentionDays.ONE_WEEK,
        });

        // Give the Lambda function permissions to access the DynamoDB table
        table.grantReadWriteData(todoFunction);

        new cdk.CfnOutput(this, 'functionArn', { value: todoFunction.functionArn });

        const logGroup = new logs.LogGroup(this, 'LogGroup', {
            retention: logs.RetentionDays.ONE_WEEK,
            logGroupName: 'serverless-todo-logs'
        });

        todoFunction.addToRolePolicy(new iam.PolicyStatement({
            actions: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            resources: [logGroup.logGroupArn]
        }));

        const api = new apigateway.RestApi(this, 'todo-api', {
            restApiName: 'Todo API'
          });
          
          const lambdaIntegration = new apigateway.LambdaIntegration(todoFunction);
          
          const todo = api.root.addResource('todo');
          
          todo.addMethod('GET', lambdaIntegration, {
            authorizationType: apigateway.AuthorizationType.NONE,
          });
          todo.addMethod('POST', lambdaIntegration, {
            authorizationType: apigateway.AuthorizationType.NONE,
          });
    }
}
