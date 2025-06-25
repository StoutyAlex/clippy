import { redirect, type LoaderFunction } from 'react-router';
import type { PartialDiscordGuild } from 'remix-auth-discord';
import { commitSession, getSession } from '~/server/session.service';

const TOKEN_URL = 'https://discord.com/api/oauth2/token';
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;

const discordApiBaseURL = 'https://discord.com/api/v10';
const userInfoURL = `${discordApiBaseURL}/users/@me`;

const ALLOWED_GUILDS = [
  '1044296040712523879', // The Very Best
];

interface DiscordProfile {
  id: string;
  username: string;
  avatar: string;
  accent_color: number;
  global_name: string;
  avatar_decoration_data: Avatardecorationdata;
  collectibles: null;
  banner_color: string;
}

interface Avatardecorationdata {
  asset: string;
  sku_id: string;
  expires_at: null;
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get('Cookie'));
  const code = new URL(request.url).searchParams.get('code');
  if (!code) {
    // TODO: Redirect to login with error message
    return new Response('Missing code parameter', { status: 400 });
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const currentDomain = new URL(request.url).origin;

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: `${currentDomain}/auth/discord/callback`,
  });

  console.log(body.get('redirect_uri'));

  const response = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body,
  });

  const tokenData = await response.json();

  console.log('Token Data:', tokenData);

  const profile = (await fetch(userInfoURL, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  }).then((res) => res.json())) as DiscordProfile;

  const userGuilds: Array<PartialDiscordGuild> = await (
    await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })
  )?.json();

  // TODO: Handle now allowd
  const allowed = userGuilds.find((g) => ALLOWED_GUILDS.includes(g.id));
  if (!allowed) {
    return new Response('You are not allowed to access this application', { status: 403 });
  }

  session.set('user', {
    id: profile.id,
    username: profile.username,
    avatar: profile.avatar,
  });

  return redirect('/', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};
