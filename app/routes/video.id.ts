import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { LoaderFunction } from 'react-router';
import { s3 } from '~/server/utils/s3';

export const loader: LoaderFunction = async ({ request, params }) => {
  const key = params.key;
  if (!key) {
    return new Response('Missing key', { status: 400 });
  }

  const range = request.headers.get('range');

  if (!range) {
    return new Response('Range header required', { status: 416 });
  }

  // Get video metadata (e.g., file size)
  const head = await s3.send(
    new GetObjectCommand({
      Bucket: 'clippy-clip-storage',
      Key: key,
    }),
  );

  const fileSize = head.ContentLength!;
  const contentType = head.ContentType || 'video/mp4';

  // Parse range header: e.g., "bytes=0-"
  const bytesPrefix = 'bytes=';
  if (!range.startsWith(bytesPrefix)) {
    return new Response('Invalid range', { status: 416 });
  }

  const [rangeStartStr, rangeEndStr] = range.replace(bytesPrefix, '').split('-');
  const rangeStart = parseInt(rangeStartStr, 10);
  const rangeEnd = rangeEndStr ? parseInt(rangeEndStr, 10) : fileSize - 1;

  const chunkSize = rangeEnd - rangeStart + 1;

  const streamCommand = new GetObjectCommand({
    Bucket: 'clippy-clip-storage',
    Key: key,
    Range: `bytes=${rangeStart}-${rangeEnd}`,
  });

  const s3Response = await s3.send(streamCommand);

  return new Response(s3Response.Body as ReadableStream, {
    status: 206,
    headers: {
      'Content-Range': `bytes ${rangeStart}-${rangeEnd}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize.toString(),
      'Content-Type': contentType,
    },
  });
};
