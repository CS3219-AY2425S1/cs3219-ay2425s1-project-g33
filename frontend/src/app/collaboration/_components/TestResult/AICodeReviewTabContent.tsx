"use client";
import { useEffect, useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useCodeReviewAnimationContext } from "@/contexts/CodeReviewAnimationContext";

export default function AICodeReviewTabContent() {
  const { codeReview } = useSessionContext();
  const { isGeneratingCodeReview, generateCodeReview, hasCodeReviewResults } = codeReview;
  const { animatedBodyText, animatedCodeSuggestionText, isBodyComplete } = useCodeReviewAnimationContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [animatedBodyText, animatedCodeSuggestionText]);

  const renderCodeReviewText = useMemo(() => {
    if (isGeneratingCodeReview) {
      return (
        <div className="flex items-center space-x-2">
          <LoadingSpinner />
          <span className="font-semibold">Reviewing your code...</span>
        </div>
      );
    }

    return (
      <div>
        <ReactMarkdown>{hasCodeReviewResults ? animatedBodyText : "No code review results available"}</ReactMarkdown>
        {isBodyComplete && (
          <SyntaxHighlighter language="python" style={vscDarkPlus}>
            {animatedCodeSuggestionText}
          </SyntaxHighlighter>
        )}
      </div>
    );
  }, [isGeneratingCodeReview, hasCodeReviewResults, animatedBodyText, animatedCodeSuggestionText, isBodyComplete]);

  return (
    <div className="h-full flex flex-col p-2">
      <div ref={scrollRef} className="flex-1 bg-background-200 rounded-sm p-2 overflow-y-scroll max-h-72">
        {renderCodeReviewText}
      </div>
      <div className="mt-5 self-end">
        <Button className="items-center space-x-2 p-3" onClick={generateCodeReview}>
          <Sparkles size={18} color="#FFFF00" />
          <span className="font-semibold text-lg">Ask AI</span>
        </Button>
      </div>
    </div>
  );
}
