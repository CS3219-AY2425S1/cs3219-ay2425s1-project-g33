import getQuestions from "@/services/questionService";
import { Questions } from "@/types/Question";
import { questionTableColumns } from "./column";
import { DataTable } from "./data-table";

export default async function QuestionTable() {
  const questions: Questions = await getQuestions();

  const categories: string[] = questions
    .map((question) => question.categories)
    .flat()
    .filter((category, index, self) => self.indexOf(category) === index)
    .sort();

  return (
    <DataTable
      columns={questionTableColumns}
      data={questions}
      categories={categories}
    />
  );
}
