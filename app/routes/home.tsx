'use client';
import { useFetcher } from 'react-router';

import { getAll, listBucket } from '~/server/clip.database';
import type { Route } from './+types/home';

import type { PresignedUrlResponse } from './api/presigned-url';
import { useEffect, useState } from 'react';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Clippy' }];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const clips = await getAll();
  const clip = await listBucket();

  return { clips, clip };
};

export default function Home(props: Route.ComponentProps) {
  const { clip } = props.loaderData;

  const [file, setFile] = useState<File>();

  const { submit: submitPresignedUrl, data: presignedUrlData } = useFetcher<PresignedUrlResponse>();

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFile(file);
  };

  useEffect(() => {
    submitPresignedUrl(
      {
        fileName: 'movie.mp4',
        fileType: 'video/mp4',
      },
      {
        method: 'post',
        action: '/api/presigned-url',
        encType: 'application/json',
      },
    );
  }, []);

  useEffect(() => {
    if (!presignedUrlData) return;
    if (!file) return;

    const formData = new FormData();
    Object.entries(presignedUrlData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });

    formData.append('file', file);

    console.log('Form data prepared for upload:', Array.from(formData.entries()));

    fetch(presignedUrlData.url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          response.text().then((text) => {
            console.error('Upload failed:', response.status, text);
            throw new Error(`Upload failed: ${response.status} ${text}`);
          });
        }
        return response.text();
      })
      .then((data) => {
        console.log('File uploaded successfully:', data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
      });
  }, [presignedUrlData, file]);

  return (
    <main className="bg-gray-500 h-screen flex-1 flex flex-col items-center p-6">
      <div id="logo-section" className="w-full flex flex-col items-center">
        Hello World
      </div>
      <div className="w-full flex justify-center">
        <video
          src="https://clippy-clip-storage.s3.eu-west-1.amazonaws.com/SampleVideo_1280x720_10mb.mp4" // will call the loader with params.key = "movie.mp4"
          controls
          width="640"
        />
      </div>
      <div>
        {presignedUrlData ? (
          <div>
            <h2>Presigned URL Data</h2>
            <div>{JSON.stringify(presignedUrlData, null, 2)}</div>
          </div>
        ) : null}
      </div>
      <input type="file" accept="video/*" onChange={onFileChange} />
    </main>
  );
}
