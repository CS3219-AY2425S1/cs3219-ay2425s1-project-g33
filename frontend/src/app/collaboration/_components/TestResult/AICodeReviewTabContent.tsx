"use client";
import { useEffect, useState, useRef } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function AICodeReviewTabContent() {
  const { codeReview } = useSessionContext();
  const { codeReviewResult, isGeneratingCodeReview, generateCodeReview, hasCodeReviewResults } = codeReview;
  const { body, codeSuggestion } = codeReviewResult;

  const [animatedBodyText, setAnimatedBodyText] = useState("");
  const [animatedCodeSuggestionText, setAnimatedCodeSuggestionText] = useState("");
  const [isBodyComplete, setIsBodyComplete] = useState(false); // Track if body typing is complete
  const typingSpeed = 10;
  const scrollRef = useRef<HTMLDivElement>(null);

  console.log(codeReviewResult)

  // Typing animation for `body`
  useEffect(() => {
    if (!hasCodeReviewResults || !body) {
      setAnimatedBodyText("No code review available");
      return;
    }

    // Reset state for a new typing effect
    setAnimatedBodyText(body[0] || '');
    setIsBodyComplete(false); // Ensure body is not marked complete initially
    let currentIndex = 0;

    const bodyInterval = setInterval(() => {
      setAnimatedBodyText((prev) => prev + body[currentIndex]);
      currentIndex += 1;

      if (currentIndex >= body.length - 1) {
        clearInterval(bodyInterval);
        setIsBodyComplete(true); // Move to code suggestion typing after body completes
      }
    }, typingSpeed);

    return () => clearInterval(bodyInterval);
  }, [hasCodeReviewResults, body, typingSpeed]);

  // Typing animation for `codeSuggestion` after `body` completes
  useEffect(() => {
    if (isBodyComplete && codeSuggestion) {
      setAnimatedCodeSuggestionText(""); // Reset code suggestion text for new typing effect
      let currentIndex = 0;

      const codeInterval = setInterval(() => {
        setAnimatedCodeSuggestionText((prev) => prev + codeSuggestion[currentIndex]);
        currentIndex += 1;

        if (currentIndex >= codeSuggestion.length - 1) {
          clearInterval(codeInterval); // End typing effect when done with code suggestion
        }
      }, typingSpeed);

      return () => clearInterval(codeInterval);
    }
  }, [isBodyComplete, codeSuggestion, typingSpeed]);

  // Auto-scroll as content animates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [animatedBodyText, animatedCodeSuggestionText]);

  const renderCodeReviewText = () => {
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
        <ReactMarkdown>{animatedBodyText}</ReactMarkdown>
        {isBodyComplete && (
          <SyntaxHighlighter language="python" style={vscDarkPlus}>
            {animatedCodeSuggestionText}
          </SyntaxHighlighter>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col p-2">
      <div ref={scrollRef} className="flex-1 bg-background-200 rounded-sm p-2 overflow-y-scroll max-h-72">
        {renderCodeReviewText()}
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
