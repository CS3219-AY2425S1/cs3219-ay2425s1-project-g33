import { HistoryItem, HistoryItemSchema } from "@/types/History";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

const TopicPreferenceColumn: ColumnDef<HistoryItem> = {
  accessorKey: "topicPreference",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Topics" className="w-1/4" />
    );
  },
  cell: ({ row }) => {
    const historyItem = HistoryItemSchema.parse(row.original);

    return (
      <div className="flex flex-wrap gap-2">
      {historyItem.topicPreference.map((category, id) => (
        <label
          key={id}
          className="px-3 py-1 rounded-md bg-background-200 text-primary"
        >
          {category}
        </label>
      ))}
    </div>
    );
  },
  sortingFn: (rowA, rowB) => {
    const a = rowA.original.topicPreference.sort();
    const b = rowB.original.topicPreference.sort();

    return a.length !== b.length
      ? a.length - b.length
      : a.join().localeCompare(b.join());
  },
  filterFn: (row, key, value: string[]) => {
    const rowValue = row.original.topicPreference;
    return rowValue.some((v) => value.includes(v));
  },
};

export default TopicPreferenceColumn;
