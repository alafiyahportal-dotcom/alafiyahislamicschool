/**
 * Launch splash for installed PWA (home-screen app).
 *
 * Android/iOS show their own splash (unit color + icon) while the page loads.
 * This overlay renders the same color + logo on first paint, then fades out,
 * so the hand-off from the OS splash to the website is a smooth fade instead
 * of a hard cut. Pure CSS (see `.launch-splash` in globals.css): no JS,
 * hidden in normal browser tabs, and it runs once per app launch because
 * the unit layout persists across client-side navigations.
 */
interface LaunchSplashProps {
  background: string;
  logoSrc: string;
  logoAlt: string;
}

export default function LaunchSplash({ background, logoSrc, logoAlt }: LaunchSplashProps) {
  return (
    <div className="launch-splash" style={{ backgroundColor: background }} aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element -- must paint instantly, no lazy/optimizer */}
      <img src={logoSrc} alt={logoAlt} width={120} height={120} decoding="sync" fetchPriority="high" />
    </div>
  );
}
