/**
 * Domain and Multi-Tenant Subdomain Utilities for Ekosistem Al-Afiyah
 * Handles routing between:
 * - Foundation / Central: alafiyah.sch.id (dev: localhost:3000)
 * - TK IT Unit:           tk.alafiyah.sch.id (dev: tk.localhost:3000)
 * - SD IT Unit:           sd.alafiyah.sch.id (dev: sd.localhost:3000)
 * - SMP IT Unit:          smp.alafiyah.sch.id (dev: smp.localhost:3000)
 */

export type SchoolSlug = 'tk' | 'sd' | 'smp';

const KNOWN_SLUGS: SchoolSlug[] = ['tk', 'sd', 'smp'];

/**
 * Parses the subdomain from a hostname (e.g. tk.localhost:3000 -> "tk")
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
    const candidate = parts[0] as SchoolSlug;
    if (KNOWN_SLUGS.includes(candidate)) {
      return candidate;
    }
  }

  return null;
}

/**
 * Returns the root domain without subdomain
 */
export function getCleanRootDomain(host?: string): string {
  const targetHost = host || (typeof window !== 'undefined' ? window.location.host : (process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'));
  const [hostname, port] = targetHost.split(':');
  const portSuffix = port ? `:${port}` : '';

  const parts = hostname.split('.');
  if (parts.length >= 2 && KNOWN_SLUGS.includes(parts[0] as SchoolSlug)) {
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

    // If accessed via numerical IP (127.0.0.1, 192.168.x.x), subdomains don't resolve by default DNS
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(currentHostname);
    if (isIpAddress) {
      if (slug === 'foundation') {
        return `${protocol}//${currentHost}${normalizedPath || '/'}`;
      }
      return `${protocol}//${currentHost}/${slug}${normalizedPath}`;
    }

    // Get root host (without tk/sd/smp prefix)
    let rootHost = currentHost;
    const parts = currentHostname.split('.');
    if (parts.length >= 2 && KNOWN_SLUGS.includes(parts[0] as SchoolSlug)) {
      rootHost = `${parts.slice(1).join('.')}${portSuffix}`;
    }

    if (slug === 'foundation') {
      return `${protocol}//${rootHost}${normalizedPath || '/'}`;
    }

    return `${protocol}//${slug}.${rootHost}${normalizedPath || '/'}`;
  }

  // Server-side / SSR resolution
  const envRoot = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  const protocol = envRoot.includes('localhost') ? 'http:' : 'https:';

  if (slug === 'foundation') {
    return `${protocol}//${envRoot}${normalizedPath || '/'}`;
  }

  return `${protocol}//${slug}.${envRoot}${normalizedPath || '/'}`;
}
