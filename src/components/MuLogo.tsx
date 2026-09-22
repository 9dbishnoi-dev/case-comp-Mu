/**
 * Official Masters' Union wordmark. The site runs on a near-black
 * background, so we use the white lockup (public/mu-logo-white.svg).
 * If this is ever placed on a light surface, swap to mu-logo-black.png.
 *
 * Plain <img>, not next/image — Next blocks SVG optimization by default
 * (security), and a static logo doesn't need the optimizer anyway.
 */
export function MuLogo({ className = "h-6 w-auto md:h-7" }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      src="/mu-logo-white.svg"
      alt="Masters' Union University"
      width={315}
      height={63}
      className={className}
    />
  );
}
