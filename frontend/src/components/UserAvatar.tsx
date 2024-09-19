import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileMiniDetailsHoverCard } from "./ProfileMiniDetailsCard";

interface UserAvatarProps {
  src: string;
  name: string;
  isHoverEnabled: boolean;
}

export default function UserAvatar({
  src,
  name,
  isHoverEnabled = true,
}: UserAvatarProps) {
  return isHoverEnabled ? (
    <ProfileMiniDetailsHoverCard>
      <AvatarWrapper src={src} name={name} />
    </ProfileMiniDetailsHoverCard>
  ) : (
    <AvatarWrapper src={src} name={name} />
  );
}

interface AvatarWrapperProps extends Omit<UserAvatarProps, "isHoverEnabled"> {}

function AvatarWrapper({ src, name }: AvatarWrapperProps) {
  function getInitialsFromName(name: string) {
    const chunks = name.split(",");

    if (chunks.length > 1) {
      const initials: string[] = [];
      chunks.forEach((chunk) => initials.push(chunk[0]));
      return initials.join("");
    } else {
      const [fname, lname] = chunks[0].split(" ");
      return `${fname[0]}${lname ? lname[0] : ""}`;
    }
  }

  return (
    <Avatar>
      <AvatarImage src={src} alt="@shadcn" />
      <AvatarFallback className="text-base font-normal text-foreground ">{getInitialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}
