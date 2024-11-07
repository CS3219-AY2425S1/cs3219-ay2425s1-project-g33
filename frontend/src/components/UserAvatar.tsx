import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileMiniDetailsHoverCard } from "./ProfileMiniDetailsCard";
import { twMerge } from "tailwind-merge";
import { UserProfile } from "@/types/User";

interface UserAvatarProps {
  userProfile: UserProfile;
  isHoverEnabled?: boolean;
  isViewProfileEnabled?: boolean;
  className?: string;
}

export default function UserAvatar({
  userProfile,
  isHoverEnabled = true,
  isViewProfileEnabled = true,
  className,
}: UserAvatarProps) {
  return isHoverEnabled ? (
    <ProfileMiniDetailsHoverCard
      isViewProfileEnabled={isViewProfileEnabled}
      userProfile={userProfile}
    >
      <AvatarWrapper userProfile={userProfile} className={className} />
    </ProfileMiniDetailsHoverCard>
  ) : (
    <AvatarWrapper userProfile={userProfile} className={className} />
  );
}

interface AvatarWrapperProps extends Omit<UserAvatarProps, "isHoverEnabled"> {}

function AvatarWrapper({ userProfile, className }: AvatarWrapperProps) {
  function getInitialsFromName(name: string) {
    // defined here for encapsulation
    const chunks = name.split(",");

    if (chunks.length > 1) {
      const initials: string[] = [];
      chunks.forEach((chunk) => initials.push(chunk[0]));
      return initials.join("");
    } else {
      const [fname, lname] = chunks[0].split(" ");
      return `${fname[0]}${lname ? lname[0] : ""}`.toUpperCase();
    }
  }

  return (
    <Avatar className={twMerge("w-9 h-9 rounded-full", className)}>
      <AvatarImage
        src={"https://nonexistentlink.com"}
        alt="user_avatar_image"
      />
      <AvatarFallback className="text-base font-normal text-foreground ">
        {getInitialsFromName(userProfile.displayName)}
      </AvatarFallback>
    </Avatar>
  );
}
