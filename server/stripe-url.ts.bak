import type { IncomingMessage } from 'node:http';

export function resolveStripeBaseUrl(
  req: IncomingMessage & { headers: Record<string, string | string[] | undefined> },
  env: Record<string, string | undefined> = process.env
) {
  const envUrl = env.APP_URL?.trim();
  if (envUrl) return envUrl;

  const protocol = (req.headers['x-forwarded-proto'] as string | undefined) || 'https';
  const host = (req.headers['x-forwarded-host'] as string | undefined) || (req.headers.host as string | undefined);
  const origin = (req.headers.origin as string | undefined) || (req.headers.referer as string | undefined);

  if (origin) {
    try {
      const parsed = new URL(origin);
      return parsed.origin;
    } catch {
      // ignore
    }
  }

  if (!host) {
    throw new Error('Host não encontrado para montar a URL de retorno do Stripe.');
  }

  return `${protocol}://${host}`;
}
