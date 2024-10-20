import { Question, QuestionSchema } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
      <Dialog>
        <DialogTrigger asChild className="hover:cursor-pointer">
          <p>{question.title}</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{question.title}</DialogTitle>
            <DialogDescription>{question.description}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  },
};

export default TitleColumn;
