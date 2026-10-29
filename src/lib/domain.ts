/**
 * Domain and Multi-Tenant Subdomain Utilities for Ekosistem Al-Afiyah
 * Handles routing between:
 * - Foundation / Central: alafiyah.id (dev: localhost:3000)
 * - TK IT Unit:           tkit.alafiyah.id (dev: tk.localhost:3000)
 * - SDIT Unit:            sdit.alafiyah.id (dev: sd.localhost:3000)
 * - SMP IT Unit:          smpit.alafiyah.id (dev: smp.localhost:3000)
 */

export type SchoolSlug = 'tk' | 'sd' | 'smp';

export const SUBDOMAIN_TO_SLUG: Record<string, SchoolSlug> = {
  tk: 'tk',
  tkit: 'tk',
  sd: 'sd',
  sdit: 'sd',
  smp: 'smp',
  smpit: 'smp',
};

export const SLUG_TO_SUBDOMAIN: Record<SchoolSlug, string> = {
  tk: 'tkit',
  sd: 'sdit',
  smp: 'smpit',
};

/**
 * Parses the subdomain from a hostname (e.g. sdit.alafiyah.id -> "sd", tk.alafiyah.id -> "tk")
 */
export function extractSubdomain(host: string): SchoolSlug | null {
  if (!host) return null;
  
  // Strip port if present
  const hostname = host.split(':')[0].toLowerCase();

  // If IP address, no subdomain support
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
    return null;
  }

  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const candidate = parts[0];
    if (candidate in SUBDOMAIN_TO_SLUG) {
      return SUBDOMAIN_TO_SLUG[candidate];
    }
  }

  return null;
}

/**
 * Returns the root domain without subdomain
 */
export function getCleanRootDomain(host?: string): string {
  const targetHost = host || (typeof window !== 'undefined' ? window.location.host : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'alafiyah.id'));
  const [hostname, port] = targetHost.split(':');
  const portSuffix = port ? `:${port}` : '';

  const parts = hostname.split('.');
  if (parts.length >= 2 && (parts[0] in SUBDOMAIN_TO_SLUG || parts[0] === 'www')) {
    return `${parts.slice(1).join('.')}${portSuffix}`;
  }

  return targetHost;
}

/**
 * Generates the full URL for a school unit or foundation
 * @param slug 'tk' | 'sd' | 'smp' | 'foundation'
 * @param path subpath such as '/kontak', '/ppdb', or '#programs'
 */
export function getSchoolUrl(slug: SchoolSlug | 'foundation', path: string = ''): string {
  const normalizedPath = path
    ? path.startsWith('/') || path.startsWith('#')
      ? path
      : `/${path}`
    : '';

  // Browser-side resolution
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol; // "http:" or "https:"
    const currentHost = window.location.host;
    const [currentHostname, port] = currentHost.split(':');
    const portSuffix = port ? `:${port}` : '';

    // If accessed via vercel.app, localhost, or numerical IP, use clean path-based routing (/sd, /smp, /tk)
    const isVercelDomain = currentHostname.endsWith('.vercel.app');
    const isLocalhost =
      currentHostname === 'localhost' ||
      currentHostname === '127.0.0.1' ||
      currentHostname.endsWith('.localhost');
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(currentHostname);

    if (isVercelDomain || isLocalhost || isIpAddress) {
      if (slug === 'foundation') {
        return normalizedPath || '/';
      }
      return `/${slug}${normalizedPath}`;
    }

    // Get root host (without school or www prefix) — prevents sdit.www.alafiyah.id
    let rootHost = currentHost;
    const parts = currentHostname.split('.');
    if (parts.length >= 2 && (parts[0] in SUBDOMAIN_TO_SLUG || parts[0] === 'www')) {
      rootHost = `${parts.slice(1).join('.')}${portSuffix}`;
    }

    if (slug === 'foundation') {
      return `${protocol}//${rootHost}${normalizedPath || '/'}`;
    }

    const targetSub = SLUG_TO_SUBDOMAIN[slug] || slug;
    return `${protocol}//${targetSub}.${rootHost}${normalizedPath || '/'}`;
  }

  // Server-side / SSR resolution:
  // Always return clean relative paths during SSR unless a custom production root domain is explicitly configured.
  // Never fallback to 'localhost' in SSR HTML so deployed pages never contain localhost links.
  const envRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim();
  if (
    !envRoot ||
    envRoot.includes('localhost') ||
    envRoot.includes('127.0.0.1') ||
    envRoot.endsWith('.vercel.app')
  ) {
    if (slug === 'foundation') {
      return normalizedPath || '/';
    }
    return `/${slug}${normalizedPath}`;
  }

  const protocol = 'https:';
  if (slug === 'foundation') {
    return `${protocol}//${envRoot}${normalizedPath || '/'}`;
  }

  const targetSub = SLUG_TO_SUBDOMAIN[slug] || slug;
  return `${protocol}//${targetSub}.${envRoot}${normalizedPath || '/'}`;
}
