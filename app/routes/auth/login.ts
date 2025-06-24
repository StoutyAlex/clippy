import { commitSession, getSession } from '~/server/session.service';
import type { Route } from '../../+types/root';
import { prisma } from '~/server/database';
import { redirect } from 'react-router';

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const data = await request.json();

  const { visitorId } = data;

  const user = await prisma.user.findFirst({
    where: { visitorId },
  });

  if (!user) {
    console.error('User not found for visitorId:', visitorId);
    return null;
  }

  session.set('user', {
    id: user.id,
    username: user.username,
    handle: user.handle,
    visitorId: user.visitorId,
  });

  return redirect('/feed', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
