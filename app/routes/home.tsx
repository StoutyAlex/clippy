import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Clippy' }];
}

export default function Home(props: Route.ComponentProps) {
  return (
    <main className="h-screen flex-1 flex bg-cream flex-col items-center justify-between p-6">
      <div id="logo-section" className="w-full flex flex-col items-center">
        Hello World
      </div>
    </main>
  );
}
