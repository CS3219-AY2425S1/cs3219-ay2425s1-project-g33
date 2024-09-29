import { Question, QuestionSchema } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { cn } from "@/lib/utils";

const DifficultyColumn: ColumnDef<Question> = {
  accessorKey: "difficulty",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader
        column={column}
        title="Difficulty"
        className="w-1/4"
      />
    );
  },
  cell: ({ row }) => {
    const question = QuestionSchema.parse(row.original);

    return (
      <span
        className={cn(
          question.difficulty == "Easy" && "text-difficulty-easy",
          question.difficulty == "Medium" && "text-difficulty-medium",
          question.difficulty == "Hard" && "text-difficulty-hard"
        )}
      >
        {question.difficulty}
      </span>
    );
  },
  sortingFn: (rowA, rowB) => {
    const difficultyMap = {
      Easy: 0,
      Medium: 1,
      Hard: 2,
    };
    return (
      difficultyMap[rowA.original.difficulty] -
      difficultyMap[rowB.original.difficulty]
    );
  },
  filterFn: (row, key, value) => {
    return value.includes(row.getValue(key));
  },
};

export default DifficultyColumn;
