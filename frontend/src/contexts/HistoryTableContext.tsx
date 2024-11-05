"use client";

import { createContext, PropsWithChildren, useState, useEffect } from "react";
import { fetchHistory } from "@/services/userService";
import { HistoryResponse } from "@/types/History";
import { Categories } from "@/types/Category";
import { getQuestionCategories } from "@/services/questionService";

export const HistoryTableContext = createContext<{
  historyData: HistoryResponse['data'];
  categories: Categories;
}>({
  historyData: [],
  categories: [],
});

export function HistoryTableProvider(props: PropsWithChildren) {
  const [historyData, setHistoryData] = useState<HistoryResponse['data']>([]);
  const [categories, setCategories] = useState<Categories>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const response = await fetchHistory();
        if (response.statusCode === 200) {
          setHistoryData(response.data);
        } else {
          console.error("Failed to fetch history:", response.message);
        }
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    getQuestionCategories().then((categoriesResponse) => {
      if (!categoriesResponse.data) {
        return;
      }
      setCategories(categoriesResponse.data.categories);
    });
  }, []);

  const providerValue = {
    historyData,
    categories
  };

  return (
    <HistoryTableContext.Provider value={providerValue}>
      {props.children}
    </HistoryTableContext.Provider>
  );
}
