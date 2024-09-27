import MainContent from "./_components/MainContent";
import SideContents from "./_components/SideContents";

export default function DashboardPage() {
  return (
    <div className="container grid grid-cols-12 gap-4 py-8 mx-auto">
      <MainContent />
      <SideContents />
    </div>
  );
}
