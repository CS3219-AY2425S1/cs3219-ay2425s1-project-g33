import { Question } from "@/types/Question";
import { ColumnDef } from "@tanstack/react-table";
import UserAvatar from "@/components/UserAvatar";
import { UserProfile } from "@/types/User";

const mockCollaborators: UserProfile[] = [
  {
    id: "1",
    username: "jmsandiegoo",
    email: "test@gmail.com",
    displayName: "Jm San Diego",
    proficiency: "Advanced",
    languages: ["Python"],
    isOnboarded: true,
    roles: ["user"],
  },
  {
    id: "2",
    username: "charliebrown",
    email: "charlie@gmail.com",
    displayName: "Charlie Brown",
    proficiency: "Beginner",
    languages: ["Python"],
    isOnboarded: true,
    roles: ["user"],
  },
];

const StatusColumn: ColumnDef<Question> = {
  accessorKey: "_id",
  header: () => <div className="px-4">Collaborators</div>,
  cell: () => {
    return (
      <div className="flex items-center space-x-0">
        {mockCollaborators.map((collaborator) => (
          <UserAvatar
            key={collaborator.username}
            userProfile={collaborator}
            isHoverEnabled={true}
            className="w-8 h-8"
          />
        ))}
      </div>
    );
  },
};

export default StatusColumn;
