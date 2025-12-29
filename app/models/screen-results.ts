export interface NormalizedAxeResult {
  severity: string;
  id: string | number;
  title: string;
  wcag: string[];
  description: string;
  affectedNodes: string[];
}

export interface GenerationResult {
  fix?: string;
  reason?: string;
}