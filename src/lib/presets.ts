export interface BrandPreset {
  label: string;
  main: string;
  button: string;
  link: string;
  // Optional explicit dark-mode brand colors. When omitted, the algorithm
  // derives dark colors from the light seed. When present, these override
  // the algorithm for brands with specific dark-mode guidelines.
  darkMain?: string;
  darkButton?: string;
  darkLink?: string;
}

export const presets: Record<string, BrandPreset> = {
  ikea: { label: 'IKEA', main: '#0058AB', button: '#0058AB', link: '#0058AB' },
  walmart: { label: 'Walmart', main: '#2563EB', button: '#2563EB', link: '#2563EB' },
  hm: { label: 'H&M', main: '#E50010', button: '#C1000E', link: '#E50010' },
};

export const defaultPreset = presets.walmart;
