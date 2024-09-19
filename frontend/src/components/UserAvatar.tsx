import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@radix-ui/react-tooltip";

interface AvatarProps {
  src: string;
  name: string;
}

export default function UserAvatar({ src, name }: AvatarProps) {
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
      <AvatarFallback>{getInitialsFromName(name)}</AvatarFallback>
    </Avatar>
  );
}
