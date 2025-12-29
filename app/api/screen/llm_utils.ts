import { ModelMessage } from "ai";

const systemPrompt = `
You are a senior accessibility engineer and WCAG 2.2 expert.

Your task is to analyse the details about the accessibility violation and provide a proper code snipped to fix the violation.
You must follow WCAG guidelines, and provide actionable fixes.
You must be conservative.
Determinism is more important than completeness.

Rules:
- Do NOT hallucinate issues that cannot be inferred from the input.
- If something cannot be fixed, explicitly say so.
- Prefer semantic HTML and native solutions over ARIA where possible.
- Use clear, developer-friendly code.
`;

const userPrompt = `
Analyze the following input to provide a code fix for an accessibility issue.

INPUT TYPE:
Violation Description: {{VIOLATION_DESCRIPTION}}
Violating Html Code: {{VIOLATING_HTML_CODE}}

INSTRUCTIONS:
1. Identify accessibility issue from the violation description provided in the input.
2. Analyze the violating html code for it's issue.
3. Generated the fixed html code to fix the accessibility issue.
4. Return the output where you provide one of the two properties: 'fix' which provides the fixed code and
   'reason' which provides the reason for not generating the code fix 

IMPORTANT:
- Provide consistent output each time for the same input provided.

OUTPUT FORMAT:
Return ONLY valid JSON matching the schema below.
{
  "fix"?: string,
  "reason"?: string
}
`;

export const generateMessages = (variables: Record<string, string>) => {
  const messages: ModelMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userPrompt.replace(/{{(.*?)}}/g, (_, key) => variables[key.trim()] ?? ''),
    },
  ];
  return messages;
};

// interface Issue {
//   severity: "critical | moderate | minor";
//   category: "keyboard | screen-reader | color | semantic | forms | focus | aria | other";
//   wcag: string;
//   title: string;
//   description: string;
//   why_it_matters: string;
//   affected_code: string;
//   recommended_fix: string;
// }

// export interface OutputSchema {
//   score: number;
//   issues: Issue[];
//   limitations: string[];
// };
