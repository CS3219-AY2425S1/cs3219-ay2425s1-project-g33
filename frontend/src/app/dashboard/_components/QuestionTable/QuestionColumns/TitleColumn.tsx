import { Question, QuestionSchema } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TitleColumn: ColumnDef<Question> = {
  accessorKey: "title",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Title" className="w-1/2" />
    );
  },
  cell: ({ row }) => {
    const question = QuestionSchema.parse(row.original);

    return (
      <HoverCard>
        <HoverCardTrigger className="hover:cursor-pointer">
          {question.title}
        </HoverCardTrigger>
        <HoverCardContent>
          <h2 className="mb-2 text-2xl">{question.title}</h2>
          <p>{question.description}</p>
        </HoverCardContent>
      </HoverCard>
    );
  },
};

export default TitleColumn;
