import { Question, QuestionSchema } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../data-table-column-header";

const TopicsColumn: ColumnDef<Question> = {
  accessorKey: "topics",
  header: ({ column }) => {
    return (
      <DataTableColumnHeader column={column} title="Topic" className="w-1/4" />
    );
  },
  cell: ({ row }) => {
    const question = QuestionSchema.parse(row.original);

    return (
      <div className="flex flex-wrap gap-2">
        {question.categories.map((category, id) => (
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
    const a = rowA.original.categories.sort();
    const b = rowB.original.categories.sort();

    return a.length !== b.length
      ? a.length - b.length
      : a.join().localeCompare(b.join());
  },
  filterFn: (row, key, value: string[]) => {
    const rowValue = row.original.categories;
    return rowValue.some((v) => value.includes(v));
  },
};

export default TopicsColumn;
