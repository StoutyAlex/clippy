import { GetObjectCommand, ListBucketsCommand } from '@aws-sdk/client-s3';
import { dynamo } from './utils/dynamo';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { s3 } from './utils/s3';

export const getAll = async () => {
  const command = new ScanCommand({
    TableName: 'clippy-clips',
    Limit: 1000,
  });

  const response = await dynamo.send(command).catch((error) => {
    console.error('Error fetching clips:', error);
    throw new Error('Failed to fetch clips from DynamoDB');
  });

  return response.Items || [];
};

export const listBucket = async () => {
  const command = new GetObjectCommand({
    Bucket: 'clippy-clip-storage',
    Key: 'SampleVideo_1280x720_10mb.mp4',
  });

  const response = await s3.send(command).catch((error) => {
    console.error('Error listing buckets:', error);
    throw new Error('Failed to list S3 buckets');
  });

  return response;
};
