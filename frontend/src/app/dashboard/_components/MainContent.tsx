import QuestionTable from "./QuestionTable";
import FilterBar from "./FilterBar";
import WelcomeMessage from "./WelcomeMessage";
import PaginationBar from "./Pagination";

export default function MainContent() {
  return (
    <section className="flex flex-col col-span-8 gap-4 xl:col-span-9 2xl:col-span-10 h-full">
      <WelcomeMessage />
      <FilterBar />
      <QuestionTable />
      <PaginationBar />
    </section>
  );
}
