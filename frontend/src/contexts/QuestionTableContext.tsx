"use client";

import { getQuestionCategories } from "@/services/questionService";
import { Categories } from "@/types/Category";
import { createContext, PropsWithChildren, useState, useEffect } from "react";

export const QuestionTableContext = createContext<{
  categories: Categories;
}>({
  categories: [],
});

export function QuestionTableProvider(props: PropsWithChildren) {
  const [categories, setCategories] = useState<Categories>([]);

  useEffect(() => {
    getQuestionCategories().then((categoriesResponse) => {
      if (!categoriesResponse.data) {
        return;
      }
      setCategories(categoriesResponse.data.categories);
    });
  }, []);

  const providerValue = {
    categories,
  };

  return (
    <QuestionTableContext.Provider value={providerValue}>
      {props.children}
    </QuestionTableContext.Provider>
  );
}
