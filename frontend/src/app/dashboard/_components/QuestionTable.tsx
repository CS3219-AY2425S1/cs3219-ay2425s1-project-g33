import { Card } from "@/components/ui/card";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import getQuestions from "@/services/questionService";
import { Question, Questions } from "@/types/Question";
import { LucideCircleCheckBig } from "lucide-react";

export default async function QuestionTable() {
  const questions: Questions = await getQuestions();

  return (
    <Card className="w-full h-full overflow-scroll">
      <Table className="h-fit max-h-80">
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 px-4">Status</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-1/3">Topic(s)</TableHead>
            <TableHead className="w-1/6 px-4 text-right">Difficulty</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="!overflow-y-scroll px-4">
          {questions.concat([...questions]).map((question: Question, i) => (
            <TableRow key={i}>
              <TableCell className="px-4">
                <LucideCircleCheckBig className="w-4 h-4 text-difficulty-easy" />
              </TableCell>
              <TableCell>{question.title}</TableCell>
              <TableCell className="flex flex-wrap gap-2">
                {question.categories.map((category, id) => (
                  <label
                    key={id}
                    className="px-3 py-1 rounded-md bg-background-200 text-primary"
                  >
                    {category}
                  </label>
                ))}
              </TableCell>
              <TableCell
                className={cn(
                  "text-right px-4",
                  question.difficulty == "Easy" && "text-difficulty-easy",
                  question.difficulty == "Medium" && "text-difficulty-medium",
                  question.difficulty == "Hard" && "text-difficulty-hard"
                )}
              >
                {question.difficulty}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
