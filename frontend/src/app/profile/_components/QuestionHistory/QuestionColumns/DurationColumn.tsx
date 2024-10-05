import { Question, QuestionSchema } from "@/types/Question";
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
  cell: ({ row }) => {
    const question = QuestionSchema.parse(row.original);

    // Placeholder duration data
    const tempDuration = Math.floor(Math.random() * 60) + 1; // Choose random duration value

    return (
      <span>
        {tempDuration} minutes
      </span>
    );
  },
  sortingFn: (rowA, rowB) => {
    const durationA = Infinity; 
    const durationB = Infinity; 
    return durationA - durationB;
  },
  filterFn: (row, key, value) => {
    const duration = row.getValue(key);
    return duration !== undefined;
  },
};

export default DurationColumn;
