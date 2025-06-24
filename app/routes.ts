import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  route('/video/:key', 'routes/video.id.ts'),

  ...prefix('/api', [route('/presigned-url', 'routes/api/presigned-url.ts')]),

  // ...prefix('/auth', [route('/login', 'routes/auth/login.ts'), route('/signup', 'routes/auth/signup.ts')]),

  // route('/login', 'routes/login.tsx'),
  // route('/signup', 'routes/signup.tsx'),
  // route('/feed', 'routes/feed.tsx'),
] satisfies RouteConfig;
