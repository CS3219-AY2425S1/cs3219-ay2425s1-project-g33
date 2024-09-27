import { getQuestions } from "@/services/questionService";
import { QuestionsResponse } from "@/types/Question";
import { questionTableColumns } from "./column";
import { DataTable } from "./data-table";

export default async function QuestionTable() {
  const questionsResponse: QuestionsResponse = await getQuestions();

  if (!questionsResponse.data) {
    return <div>{questionsResponse.message}</div>;
  }

  const questions = questionsResponse.data.questions;
  const totalCategories = questionsResponse.data.totalCategories;

  return (
    <DataTable
      columns={questionTableColumns}
      data={questions}
      categories={totalCategories}
    />
  );
}
