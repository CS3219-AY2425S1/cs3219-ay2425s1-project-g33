import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/dashboard");
  return (
    <main className="flex items-center justify-center w-full h-full min-h-screen">
      <div>
        <h1 className="text-primary">Hello world</h1>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-background" />
          <p>Background - General background</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-background-100" />
          <p>Background-100 - For list item</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-background-200" />
          <p>Background-200 - For elements within list item</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-foreground" />
          <p>Foreground - For text</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-accent" />
          <p>Accent - For badges, avatars etc.</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-accent-foreground" />
          <p>Accent - For texts on accent background</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-primary" />
          <p>Primary</p>
        </div>
        <div className="flex flex-row items-center gap-4">
          <div className="w-5 h-5 bg-primary-foreground" />
          <p>Primary-Foreground</p>
        </div>
      </div>
    </main>
  );
}
