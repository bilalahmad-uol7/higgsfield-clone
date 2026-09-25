// Full-screen film grain. The noise tile is an inline SVG turbulence filter,
// oversized and jittered in steps so it reads as projected grain rather than
// a static texture. Purely decorative — never intercepts pointer events.
const NOISE = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

export function FilmGrain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[70] overflow-hidden opacity-[0.07] mix-blend-overlay">
      <div className="absolute -inset-[10%] animate-grain" style={{ backgroundImage: NOISE }} />
    </div>
  );
}
