import { getAll, listBucket } from '~/server/clip.database';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Clippy' }];
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const clips = await getAll();
  const clip = await listBucket();

  console.log('Clips loaded:', clips.length);
  console.log('Buckets loaded:', clip);

  return { clips, clip };
};

export default function Home(props: Route.ComponentProps) {
  const { clip } = props.loaderData;

  return (
    <main className="h-screen flex-1 flex flex-col items-center justify-between p-6">
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
    </main>
  );
}
