import { createCookieSessionStorage } from 'react-router';

export const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: 'bs:session',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 5,
    path: '/',
    sameSite: 'lax',
    secrets: ['f3cr@z7'],
    secure: true,
  },
});
