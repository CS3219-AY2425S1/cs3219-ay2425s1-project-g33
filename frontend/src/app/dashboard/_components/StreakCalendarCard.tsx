import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";

export default function StreakCalendarCard() {
  return (
    <Card className="flex justify-center">
      <Calendar className="text-sm"/>
    </Card>
  );
}
