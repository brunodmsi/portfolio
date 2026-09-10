export interface WorldInput {
  progress: number;
  pointer: [number, number];
  pulse: number;
  velocity: number;
  language: number | null;
  languageAnchors: DOMRect[];
}
