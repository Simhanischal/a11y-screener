import { z } from "zod";

export const schema = z.object({
  fix: z.string().optional(),
  reason: z.string().optional(),
});