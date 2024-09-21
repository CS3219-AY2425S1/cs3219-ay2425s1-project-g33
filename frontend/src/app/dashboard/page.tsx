import { Card } from "@/components/ui/card";
import SideContents from "./_components/SideContents";

export default function DashboardPage() {
  return (
    <div className="container grid grid-cols-12 gap-4 py-8 mx-auto">
      <section className="flex flex-col col-span-8 xl:col-span-9 2xl:col-span-10 gap-4">
        <h1 className="text-xl">Welcome Back, Diego!</h1>
        <Card>Question Section</Card>
      </section>
      <SideContents/>
    </div>
  );
}
