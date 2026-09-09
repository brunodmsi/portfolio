export interface WorldInput {
  progress: number;
  pointer: [number, number];
  pulse: number;
  velocity: number;
  project: number | null;
  language: number | null;
  projectAnchors: DOMRect[];
  languageAnchors: DOMRect[];
}
