# Todo App using AWS CDK

This project is a simple to-do list application that uses AWS CDK to create a serverless architecture. The front-end is built using HTML, CSS and JavaScript, while the back-end uses DynamoDB for data storage and AWS Lambda for serverless functions.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

## Prerequisites

- Node.js version 12 or higher
- AWS account
- AWS CLI
- AWS CDK
- Typescript

## Installing

1. `git clone https://github.com/yourusername/todo-app-cdk.git`

2. Install the necessary dependencies

`cd todo-app-cdk`

`npm install`

3. Deploy the CDK stack

`cdk deploy`

4. Update the `config.js` file in the public folder with the appropriate DynamoDB Table name and region

5. Open the `index.html` file in a browser to use the application

## Built With

- AWS CDK - The cloud development framework used
- DynamoDB - NoSQL database for data storage
- AWS Lambda - Serverless compute service
- HTML - Front-end markup language
- CSS - Front-end styling language
- JavaScript - Front-end scripting language