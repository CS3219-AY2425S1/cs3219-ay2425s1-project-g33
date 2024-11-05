import { HistoryItem, HistoryItemSchema } from "@/types/History";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`; // "November 05, 2024"
}

const DateColumn: ColumnDef<HistoryItem> = {
  accessorKey: "question.date",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Date" className="w-1/2" />
    );
  },
  cell: ({ row }) => {
    const historyItem = HistoryItemSchema.parse(row.original);
    const formattedDate = formatDate(historyItem.date); 
    // const formattedDate =historyItem.date;

    return (
      <HoverCard>
        <HoverCardTrigger className="hover:cursor-pointer">
          {formattedDate}
        </HoverCardTrigger>
        <HoverCardContent>
          <h2 className="mb-2 text-2xl">{formattedDate}</h2>
        </HoverCardContent>
      </HoverCard>
    );
  },
};

export default DateColumn;
