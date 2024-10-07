import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import UserAvatar from "@/components/UserAvatar";

const mockCollaborators = [
  { id: 1, name: "Jm San Diego" },
  { id: 2, name: "Charlie Brown"},
];

const StatusColumn: ColumnDef<Question> = {
  accessorKey: "_id",
  header: () => <div className="px-4">Collaborators</div>,
  cell: () => {
    return (
      <div className="flex items-center space-x-0">
        {mockCollaborators.map((collaborator) => (
          <UserAvatar
            key={collaborator.id}
            src={"https://non-existent.com"}
            name={collaborator.name}
            isHoverEnabled={true}
            className="w-8 h-8" 
          />
        ))}
      </div>
    );
  },
};

export default StatusColumn;
