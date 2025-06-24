import { commitSession, getSession } from '~/server/session.service';
import type { Route } from '../../+types/root';
import { prisma } from '~/server/database';
import { redirect } from 'react-router';

const findOrCreateUser = async (visitorId: string, username: string, handle: string) => {
  const existingUser = await prisma.user.findFirst({
    where: { visitorId },
  });

  if (existingUser) {
    return existingUser;
  }

  return await prisma.user.create({
    data: {
      visitorId,
      username,
      handle,
    },
  });
};

export const action = async ({ request }: Route.ActionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));
  const data = await request.json();

  const { visitorId, username, handle } = data;

  const user = await findOrCreateUser(visitorId, username, handle);

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
