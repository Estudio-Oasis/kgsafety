// Resolve scraped real images at build time via Vite glob.
// Returns deterministic image URL for a bucket + index.
import { REAL_ASSETS, type RealBucket } from "@/data/real-assets";

const modules = import.meta.glob("@/assets/real/**/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

// Build a lookup keyed by "<bucket>/<file>" (matches REAL_ASSETS entries)
const byPath: Record<string, string> = {};
for (const [p, url] of Object.entries(modules)) {
  const m = p.match(/\/assets\/real\/(.+)$/);
  if (m) byPath[m[1]] = url;
}

export function realImage(bucket: RealBucket | string, idx = 0): string | undefined {
  const list = REAL_ASSETS[bucket as RealBucket];
  if (!list || list.length === 0) return undefined;
  const pick = list[idx % list.length];
  return byPath[pick];
}

export function realImagesIn(bucket: RealBucket | string): string[] {
  const list = REAL_ASSETS[bucket as RealBucket] ?? [];
  return list.map((p) => byPath[p]).filter(Boolean);
}

export function realImageBySlug(slug: string, fallbackBucket: string = "consultoria", idx = 0) {
  // try bucket named "cursos-<slug>" / "eq-<slug>" / "ing-<slug>" first
  const cand = [
    `cursos-${slug}`, `eq-${slug}`, `ing-${slug}`, slug,
  ];
  for (const b of cand) {
    const v = realImage(b, idx);
    if (v) return v;
  }
  return realImage(fallbackBucket, idx);
}
