import { HistoryItem, HistoryItemSchema } from "@/types/History";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { cn } from "@/lib/utils";

const DifficultyPreferenceColumn: ColumnDef<HistoryItem> = {
  accessorKey: "difficultyPreference",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Difficulty" className="w-1/4" />
    );
  },
  cell: ({ row }) => {
    const historyItem = HistoryItemSchema.parse(row.original);
    return (
      <span
      className={cn(
        historyItem.difficultyPreference == "Easy" && "text-difficulty-easy",
        historyItem.difficultyPreference == "Medium" && "text-difficulty-medium",
        historyItem.difficultyPreference == "Hard" && "text-difficulty-hard"
      )}
    >
      {historyItem.difficultyPreference}
    </span>
    );
  },
};

export default DifficultyPreferenceColumn;
