import { Question } from "@/types/Question";

export default function QuestionCard({ question }: { question: Question }) {
  return (
    <div className="flex flex-col gap-2">
      <h2>{question.title}</h2>
      <p>{question.description}</p>
    </div>
  );
}
