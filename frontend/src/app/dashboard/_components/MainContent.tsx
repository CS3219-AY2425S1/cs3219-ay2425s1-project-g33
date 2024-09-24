import QuestionTable from "./QuestionTable";
import FilterBar from "./FilterBar";
import WelcomeMessage from "./WelcomeMessage";
import PaginationBar from "./Pagination";
import { cn } from "@/lib/utils";

export default function MainContent() {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 h-full",
        "col-span-8 xl:col-span-9"
      )}
    >
      <WelcomeMessage />
      <FilterBar />
      <QuestionTable />
      <PaginationBar />
    </section>
  );
}
