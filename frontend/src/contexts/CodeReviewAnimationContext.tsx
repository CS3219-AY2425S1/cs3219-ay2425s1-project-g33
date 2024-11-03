import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useSessionContext } from "./SessionContext";

interface CodeReviewAnimationContextType {
  animatedBodyText: string;
  animatedCodeSuggestionText: string;
  isBodyComplete: boolean;
  startAnimation: (body: string, codeSuggestion: string) => void;
}

const CodeReviewAnimationContext = createContext<CodeReviewAnimationContextType>({
  animatedBodyText: "",
  animatedCodeSuggestionText: "",
  isBodyComplete: false,
  startAnimation: () => {},
});

export const CodeReviewAnimationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { codeReview } = useSessionContext();
  const { codeReviewResult, hasCodeReviewResults } = codeReview;
  const [animatedBodyText, setAnimatedBodyText] = useState("");
  const [animatedCodeSuggestionText, setAnimatedCodeSuggestionText] = useState("");
  const [isBodyComplete, setIsBodyComplete] = useState(false);
  const typingSpeed = 5;

  const resetState = useCallback(() => {
    setAnimatedBodyText("");
    setAnimatedCodeSuggestionText("");
    setIsBodyComplete(false);
  }, []);

  // Function to start the typing animation
  const startAnimation = useCallback(
    (body: string, codeSuggestion: string) => {
      resetState();

      let bodyIndex = 0;
      const bodyInterval = setInterval(() => {
        setAnimatedBodyText((prev) => prev + body[bodyIndex]);
        bodyIndex += 1;

        if (bodyIndex >= body.length - 1) {
          clearInterval(bodyInterval);
          setIsBodyComplete(true);

          let codeIndex = 0;
          const codeInterval = setInterval(() => {
            setAnimatedCodeSuggestionText((prev) => prev + codeSuggestion[codeIndex]);
            codeIndex += 1;

            if (codeIndex >= codeSuggestion.length - 1) {
              clearInterval(codeInterval);
            }
          }, typingSpeed);

          return () => clearInterval(codeInterval);
        }
      }, typingSpeed);

      return () => clearInterval(bodyInterval);
    },
    [typingSpeed, resetState]
  );

  useEffect(() => {
    if (codeReviewResult && hasCodeReviewResults) {
      const { body, codeSuggestion } = codeReviewResult;
      startAnimation(body, codeSuggestion);
    }

    return () => {
      resetState();
    };
  }, [codeReviewResult, startAnimation, hasCodeReviewResults, resetState]);

  return (
    <CodeReviewAnimationContext.Provider
      value={{
        animatedBodyText,
        animatedCodeSuggestionText,
        isBodyComplete,
        startAnimation,
      }}
    >
      {children}
    </CodeReviewAnimationContext.Provider>
  );
};

// Custom hook to use the CodeReviewAnimation context
export const useCodeReviewAnimationContext = () => useContext(CodeReviewAnimationContext);
