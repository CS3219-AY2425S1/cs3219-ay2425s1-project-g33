import {
  getQuestionCategories,
  getQuestions,
} from "@/services/questionService";
import { QuestionsResponse } from "@/types/Question";
import { CategoriesResponse } from "@/types/Category";
import { questionTableColumns } from "./column";
import { DataTable } from "./data-table";
import { HistoryResponseSchema } from "@/types/History";
import { fetchHistory } from "@/services/userService";

export default async function HistoryTable() {
  const questionsResponse: QuestionsResponse = await getQuestions();
  const categoriesResponse: CategoriesResponse = await getQuestionCategories();

  let historyResponse;
  historyResponse = await fetchHistory();

  if (historyResponse.statusCode !== 200) {
    throw new Error(historyResponse.message);
  }

  const validatedHistoryResponse = HistoryResponseSchema.parse(historyResponse);

  const history = validatedHistoryResponse.data;

  const questions = questionsResponse.data.questions;
  const categories = categoriesResponse.data
    ? categoriesResponse.data.categories
    : [];

  return (
    <DataTable
      columns={questionTableColumns}
      data={history}
      categories={categories}
    />
  );
}
