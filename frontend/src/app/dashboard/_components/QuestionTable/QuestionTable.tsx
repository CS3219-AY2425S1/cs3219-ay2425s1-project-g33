import {
  getQuestionCategories,
  getQuestions,
} from "@/services/questionService";
import { QuestionsResponse } from "@/types/Question";
import { CategoriesResponse } from "@/types/Category";
import { questionTableColumns } from "./column";
import { DataTable } from "./data-table";
import { redirect } from "next/navigation";

export default async function QuestionTable() {
  const questionsResponse: QuestionsResponse = await getQuestions();
  const categoriesResponse: CategoriesResponse = await getQuestionCategories();

  if (
    questionsResponse.statusCode === 401 ||
    categoriesResponse.statusCode === 401
  ) {
    redirect("/auth/signin");
  }

  if (!questionsResponse.data) {
    return <div>{questionsResponse.message}</div>;
  }

  const questions = questionsResponse.data.questions;
  const categories = categoriesResponse.data
    ? categoriesResponse.data.categories
    : [];

  return (
    <DataTable
      columns={questionTableColumns}
      data={questions}
      categories={categories}
    />
  );
}
