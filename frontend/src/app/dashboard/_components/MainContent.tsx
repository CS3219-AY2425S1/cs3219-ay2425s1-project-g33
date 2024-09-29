import QuestionTable from "./QuestionTable/QuestionTable";
import WelcomeMessage from "./WelcomeMessage";
import { cn } from "@/lib/utils";

export default function MainContent() {
  return (
    <section
      className={cn("flex flex-col gap-4 h-full", "col-span-8 xl:col-span-9")}
    >
      <WelcomeMessage />
      <QuestionTable />
    </section>
  );
}
