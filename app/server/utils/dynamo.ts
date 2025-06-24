import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not defined');
}

const client = new DynamoDBClient({
  region: 'eu-west-1', // Change to your desired region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const dynamo = DynamoDBDocumentClient.from(client);
