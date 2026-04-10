export interface BrandPreset {
  label: string;
  main: string;
  button: string;
  link: string;
}

export const presets: Record<string, BrandPreset> = {
  ikea: { label: 'IKEA', main: '#0058AB', button: '#0058AB', link: '#0058AB' },
  walmart: { label: 'Walmart', main: '#2563EB', button: '#2563EB', link: '#2563EB' },
  hm: { label: 'H&M', main: '#E50010', button: '#C1000E', link: '#E50010' },
};

export const defaultPreset = presets.walmart;
