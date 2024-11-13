import { z } from "zod";

const TestResultSchema = z.object({
  passed: z.boolean(),
  input: z.string(),
  output: z.string(),
  expectedOutput: z.string(),
  executionTime: z.number(),
});

const SubmissionResultSchema = z.array(TestResultSchema);

export type TestResult = z.infer<typeof TestResultSchema>;
export type SubmissionResult = z.infer<typeof SubmissionResultSchema>;
