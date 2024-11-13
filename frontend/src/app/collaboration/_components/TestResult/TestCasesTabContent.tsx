import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Question, TestCase } from "@/types/Question";

interface TestCasesTabContentProps {
  question: Question;
}

export default function TestCasesTabContent({
  question,
}: TestCasesTabContentProps) {
  return (
    <Tabs defaultValue={`test-case-0`} className="w-full h-full p-2">
      <TabsList className="flex flex-row justify-start gap-2 bg-transparent p-0">
        {question.testCases.map((_, index: number) => (
          <TabsTrigger value={`test-case-${index}`} key={index}>
            Test case {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>
      {question.testCases.map((testCase: TestCase, index: number) => (
        <TabsContent
          value={`test-case-${index}`}
          key={index}
          className="p-0 text-sm"
        >
          <div className="flex flex-col gap-2">
            <label>
              <p className="text-xs text-foreground-100 mb-1">Input =</p>
              <p className="px-2 py-1 rounded-md bg-background-100">
                {testCase.input}
              </p>
            </label>
            <label>
              <p className="text-xs text-foreground-100 mb-1">
                Expected output =
              </p>
              <p className="px-2 py-1 rounded-md bg-background-100">
                {testCase.expectedOutput}
              </p>
            </label>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
