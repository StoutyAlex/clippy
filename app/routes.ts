import { type RouteConfig, index, prefix, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),

  // ...prefix('/auth', [route('/login', 'routes/auth/login.ts'), route('/signup', 'routes/auth/signup.ts')]),

  // route('/login', 'routes/login.tsx'),
  // route('/signup', 'routes/signup.tsx'),
  // route('/feed', 'routes/feed.tsx'),
] satisfies RouteConfig;
