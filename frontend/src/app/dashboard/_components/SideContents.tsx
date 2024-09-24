import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import StreakCalendarCard from "./StreakCalendarCard";
import { QuestionsStatsCard } from "./QuestionsStatsCard";
import { FindMatchButton } from "./FindMatchButton";
import { cn } from "@/lib/utils";

export default function SideContents() {
  return (
    <div
      className={cn(
        "relative h-full w-full",
        "col-span-4 xl:col-span-3 2xl:col-span-2"
      )}
    >
      <aside className="sticky flex flex-col gap-4 h-fit top-20">
        <ProfileMiniDetailsCard />
        <StreakCalendarCard />
        <QuestionsStatsCard />
        <FindMatchButton />
      </aside>
    </div>
  );
}
