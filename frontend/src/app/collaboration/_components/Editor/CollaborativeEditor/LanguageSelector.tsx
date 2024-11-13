"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSessionContext } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";

interface LanguageSelectorProps {
  className?: string;
}

export default function LanguageSelector({ className }: LanguageSelectorProps) {
  const { language, changeLanguage } = useSessionContext();

  return (
    <Select value={language} onValueChange={changeLanguage} dir="rtl">
      <SelectTrigger
        className={cn(
          "w-fit h-7 bg-background text-foreground focus:outline-none",
          // "h-7 hover:bg-transparent hover:text-primary text-card-foreground-100 data-[state=active]:text-foreground",
          className
        )}
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="bg-background">
        <SelectGroup>
          <SelectItem value="python3">Python3</SelectItem>
          <SelectItem value="java">Java</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
