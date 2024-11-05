import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HistoryItem, HistoryItemSchema } from "@/types/History";

const TitleColumn: ColumnDef<HistoryItem> = {
  accessorKey: "questionTitle",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Title" className="w-1/2" />
    );
  },
  cell: ({ row }) => {
    const historyItem = HistoryItemSchema.parse(row.original);

    return (
      <Dialog>
        <DialogTrigger asChild className="hover:cursor-pointer">
          <p>{historyItem.question.title}</p>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{historyItem.question.title}</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  },
};

export default TitleColumn;
