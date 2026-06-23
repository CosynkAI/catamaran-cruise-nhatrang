const CANONICAL_HOSTS = new Set(['seatrips-nhatrang.com', 'www.seatrips-nhatrang.com']);
const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

/** Redirect preview mirrors (pages.dev, etc.) to the canonical production host. */
export async function onRequest(context) {
  const url = new URL(context.request.url);
  const host = url.hostname.toLowerCase();

  if (CANONICAL_HOSTS.has(host) || LOCAL_HOSTS.has(host)) {
    return context.next();
  }

  url.protocol = 'https:';
  url.hostname = 'seatrips-nhatrang.com';
  return Response.redirect(url.toString(), 301);
}
