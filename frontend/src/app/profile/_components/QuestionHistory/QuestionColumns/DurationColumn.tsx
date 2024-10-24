import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

const DurationColumn: ColumnDef<Question> = {
  accessorKey: "duration",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader
        column={column}
        title="Duration"
        className="w-1/4"
      />
    );
  },
  cell: () => {
    // Placeholder duration data
    const tempDuration = 20; // Choose random duration value

    return <span>{tempDuration} minutes</span>;
  },
  sortingFn: () => {
    const durationA = Infinity;
    const durationB = Infinity;
    return durationA - durationB;
  },
  filterFn: (row, key) => {
    const duration = row.getValue(key);
    return duration !== undefined;
  },
};

export default DurationColumn;
