"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSessionContext } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";
import { TestResult } from "@/types/TestResult";
import { useMemo } from "react";

export default function TestResultTabContent() {
  const { submissionResult } = useSessionContext();

  const correctOutput = useMemo(() => {
    // Check if submissioNResult has a test case that is not passed
    if (!submissionResult) {
      return false;
    }
    return submissionResult.filter((s) => !s.passed).length === 0;
  }, [submissionResult]);

  const averageRuntime = useMemo(() => {
    if (!submissionResult) {
      return 0;
    }
    return (
      submissionResult.reduce((acc: number, testResult: TestResult) => {
        return acc + testResult.executionTime;
      }, 0) / submissionResult.length
    );
  }, [submissionResult]);

  return (
    <div className="flex flex-col w-full h-full p-2">
      {submissionResult ? (
        <>
          <span className="flex flex-row items-center gap-2 p-2">
            <h2
              className={cn(
                "text-2xl font-bold",
                correctOutput ? "text-green-400" : "text-red-400"
              )}
            >
              {correctOutput ? "Correct" : "Wrong"} Answer
            </h2>
            <p className="mt-1 text-sm text-foreground-100">
              Runtime: {averageRuntime}ms
            </p>
          </span>
          <Tabs defaultValue={`test-case-0`} className="w-full h-full p-2">
            <TabsList className="flex flex-row justify-start gap-2 p-0 bg-transparent">
              {submissionResult.map((testResult: TestResult, index: number) => (
                <TabsTrigger value={`test-case-${index}`} key={index}>
                  <span
                    className={cn(
                      "mr-2 text-xl",
                      testResult.passed ? "text-green-400" : "text-red-400"
                    )}
                  >
                    •
                  </span>
                  Test case {index + 1}
                </TabsTrigger>
              ))}
            </TabsList>
            {submissionResult.map((testResult: TestResult, index: number) => (
              <TabsContent
                value={`test-case-${index}`}
                key={index}
                className="p-0 text-sm"
              >
                <div className="flex flex-col gap-2">
                  <label>
                    <p className="mb-1 text-xs text-foreground-100">Input =</p>
                    <p className="px-2 py-1 rounded-md bg-background-100">
                      {testResult.input}
                    </p>
                  </label>
                  <label>
                    <p className="mb-1 text-xs text-foreground-100">Output =</p>
                    <p
                      className={cn(
                        "px-2 py-1 rounded-md bg-background-100",
                        testResult.output.toLowerCase().includes("error") &&
                          "text-red-400"
                      )}
                    >
                      {testResult.output}
                    </p>
                  </label>
                  <label>
                    <p className="mb-1 text-xs text-foreground-100">
                      Expected output =
                    </p>
                    <p className="px-2 py-1 rounded-md bg-background-100">
                      {testResult.expectedOutput}
                    </p>
                  </label>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <p>You must submit your code to see the test result</p>
        </div>
      )}
    </div>
  );
}
