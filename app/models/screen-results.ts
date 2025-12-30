export interface NormalizedAxeResult {
  severity: string;
  id: string | number;
  title: string;
  helpUrl: string | null;
  wcag: string[];
  description: string;
  affectedNodes: string[];
}

export interface GenerationResult {
  fix?: string;
  reason?: string;
}