/**
 * MotivAlarm Instagram Proxy — Cloudflare Worker
 *
 * Deploy:
 *   1. Install Wrangler: npm install -g wrangler
 *   2. wrangler login
 *   3. wrangler deploy
 *
 * Environment variables (set via wrangler secret or dashboard):
 *   META_APP_TOKEN — Format: "APP_ID|CLIENT_TOKEN" from Meta Developer Console
 */

export interface Env {
  META_APP_TOKEN?: string;
}

interface InstagramPhoto {
  url: string;
  thumbnail: string;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const username = url.searchParams.get('u');

    if (!username) {
      return new Response(
        JSON.stringify({ error: 'Missing username parameter ?u=username' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    try {
      const photos = await fetchInstagramPhotos(username, env.META_APP_TOKEN);
      return new Response(JSON.stringify({ photos, username }), {
        headers: CORS_HEADERS,
      });
    } catch (err: any) {
      return new Response(
        JSON.stringify({ error: err.message ?? 'Failed to fetch photos' }),
        { status: 500, headers: CORS_HEADERS }
      );
    }
  },
};

async function fetchInstagramPhotos(
  username: string,
  appToken?: string
): Promise<InstagramPhoto[]> {
  // Strategy 1: Use Meta Graph API oEmbed if we have a token
  // (requires user to have shared specific post URLs — limited)
  // Strategy 2: Fetch public profile page and extract JSON
  const profileUrl = `https://www.instagram.com/${encodeURIComponent(username)}/?__a=1&__d=dis`;

  const response = await fetch(profileUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  if (!response.ok) {
    throw new Error(`Instagram returned ${response.status}`);
  }

  const text = await response.text();

  // Try JSON response
  try {
    const data = JSON.parse(text);
    const edges =
      data?.graphql?.user?.edge_owner_to_timeline_media?.edges ??
      data?.data?.user?.edge_owner_to_timeline_media?.edges ??
      [];

    return edges.slice(0, 20).map((edge: any) => {
      const node = edge.node;
      const fullUrl =
        node.display_url ??
        node.display_resources?.[node.display_resources.length - 1]?.src ??
        '';
      const thumbUrl =
        node.thumbnail_src ??
        node.display_resources?.[0]?.src ??
        fullUrl;
      return { url: fullUrl, thumbnail: thumbUrl };
    }).filter((p: InstagramPhoto) => p.url);
  } catch {
    // HTML response — extract from script tags
    return extractPhotosFromHTML(text);
  }
}

function extractPhotosFromHTML(html: string): InstagramPhoto[] {
  const photos: InstagramPhoto[] = [];

  // Pattern: find display_url in script tags
  const scriptMatch = html.match(/<script[^>]*>window\._sharedData\s*=\s*({.+?});<\/script>/s);
  if (!scriptMatch) return photos;

  try {
    const shared = JSON.parse(scriptMatch[1]);
    const edges =
      shared?.entry_data?.ProfilePage?.[0]?.graphql?.user
        ?.edge_owner_to_timeline_media?.edges ?? [];

    for (const edge of edges.slice(0, 20)) {
      const node = edge.node;
      const url = node.display_url ?? '';
      const thumbnail = node.thumbnail_src ?? url;
      if (url) photos.push({ url, thumbnail });
    }
  } catch {
    // Couldn't parse
  }

  return photos;
}
