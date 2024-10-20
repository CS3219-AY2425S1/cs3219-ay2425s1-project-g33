import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import { Zap } from "lucide-react";

const StatusColumn: ColumnDef<Question> = {
  accessorKey: "_id",
  header: () => <div className="px-4">Elo</div>,
  cell: () => {
    return (
      <div className="px-4">
            <span className="text-primary">
              100 <Zap className="inline" size={14} />
            </span>
        </div>
    );
  },
};

export default StatusColumn;
