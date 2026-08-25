export const ADSENSE_EXCLUDED_PATHS = ["/privacy", "/terms"] as const;

export function isAdsenseExcludedPath(pathname: string) {
  return ADSENSE_EXCLUDED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}
