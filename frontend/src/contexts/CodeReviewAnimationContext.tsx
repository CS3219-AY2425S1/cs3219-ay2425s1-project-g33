import React, { createContext, useCallback, useContext, useState } from "react";

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
  const [animatedBodyText, setAnimatedBodyText] = useState("");
  const [animatedCodeSuggestionText, setAnimatedCodeSuggestionText] = useState("");
  const [isBodyComplete, setIsBodyComplete] = useState(false);
  const typingSpeed = 10;

  // Function to start the typing animation
  const startAnimation = useCallback((body: string, codeSuggestion: string) => {
    setAnimatedBodyText(""); // Reset texts for new animation
    setAnimatedCodeSuggestionText("");
    setIsBodyComplete(false);

    // Animate body text
    let bodyIndex = 0;
    const bodyInterval = setInterval(() => {
      setAnimatedBodyText((prev) => prev + body[bodyIndex]);
      bodyIndex += 1;

      if (bodyIndex >= body.length - 1) {
        clearInterval(bodyInterval);
        setIsBodyComplete(true);

        // Start code suggestion animation after body completes
        let codeIndex = 0;
        const codeInterval = setInterval(() => {
          setAnimatedCodeSuggestionText((prev) => prev + codeSuggestion[codeIndex]);
          codeIndex += 1;

          if (codeIndex >= codeSuggestion.length - 1) {
            clearInterval(codeInterval);
          }
        }, typingSpeed);
      }
    }, typingSpeed);
  }, []);

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


