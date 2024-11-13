import UserAvatar from "@/components/UserAvatar";
import { Card } from "@/components/ui/card";
import { Zap } from "lucide-react";
import { UserProfile } from "@/types/User";

interface ProfileCardProps {
  userProfile: UserProfile;
}

export function ProfileCard({ userProfile }: ProfileCardProps) {
  return (
    <Card className="p-5">
      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-4">
          <UserAvatar
            userProfile={userProfile}
            isHoverEnabled={false}
            className="w-16 h-16"
          />
          <div>
            <h4 className="leading-none">{userProfile.displayName}</h4>
            <small className="inline-block mb-1 text-card-foreground-100">
              @{userProfile.username}
            </small>
            <p>
              Proficiency:{" "}
              <span className="text-card-foreground-100">
                {userProfile.proficiency}
              </span>
            </p>
            <p>
              Elo:{" "}
              <span className="text-primary">
                1000 <Zap className="inline" size={14} />
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
