import { s3 } from '~/server/utils/s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import type { Route } from '../../+types/root';

export interface PresignedUrlRequest {
  fileName: string;
  fileType: string;
  folder?: string;
}

export interface PresignedUrlResponse {
  url: string;
  fields: Record<string, string>;
}

export const action = async ({ request }: Route.ActionArgs) => {
  const { fileName, fileType, folder } = (await request.json()) as PresignedUrlRequest;

  const key = folder ? `${folder}/${fileName}` : fileName;

  const presignedPost = await createPresignedPost(s3, {
    Bucket: 'clippy-clip-storage',
    Key: key,
    Fields: {
      'Content-Type': fileType,
    },
    Conditions: [
      ['content-length-range', 0, 30000000], // 30 MB limit
    ],
    Expires: 60 * 10, // 10 minutes
  });

  if (!presignedPost) {
    return new Response('Failed to create presigned URL', { status: 500 });
  }

  const response: PresignedUrlResponse = {
    url: presignedPost.url,
    fields: presignedPost.fields,
  };

  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
