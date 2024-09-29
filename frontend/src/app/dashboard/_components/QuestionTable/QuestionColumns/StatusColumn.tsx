import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { LucideCircleCheckBig } from "lucide-react";

const StatusColumn: ColumnDef<Question> = {
  accessorKey: "_id",
  header: () => <div className="px-4">Status</div>,
  cell: () => {
    return (
      <div className="px-4">
        <LucideCircleCheckBig className="w-4 h-4 text-difficulty-easy" />
      </div>
    );
  },
};

export default StatusColumn;
