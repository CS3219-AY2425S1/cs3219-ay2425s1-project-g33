"use client"
import { useState } from "react";
import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import { Card } from "@/components/ui/card";
import { BookOpen, CodeXml, Glasses, Mail } from "lucide-react";
import { EditProfile } from "./EditProfile";

export default function SideContents() {
  const [isOpen, setIsOpen] = useState(false);

  const userProfile = {
    displayName: "John Doe",
    username: "johndoe123",
    email: "johndoe@example.com",
    proficiency: "Expert",
  };

  return (
    <Card className="p-4 w-full max-w-xs rounded-lg">
      <ProfileMiniDetailsCard />

      <div className="flex flex-col gap-2 mb-6">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-sm font-semibold py-2 rounded-md"
        >
          Edit Profile
        </button>
        <button className="bg-primary text-sm font-semibold py-2 rounded-md">
          Change Password
        </button>
      </div>

      {/* User Info */}
      <div>
        <div className="flex flex-row gap-2 p-1">
          <Mail className="text-primary" />
          <h4>Email:</h4>
          <h4 className="text-card-foreground-100">skibidi@sigma.com</h4>
        </div>

        <div className="flex flex-row gap-2 p-1">
          <Glasses className="text-primary" />
          <h4>Proficiency:</h4>
          <h4 className="text-card-foreground-100">Expert</h4>
        </div>

        <div className="flex flex-row gap-2 p-1">
          <CodeXml className="text-primary" />
          <h4>Language:</h4>
          <h4 className="text-card-foreground-100">Java</h4>
        </div>

        <div className="flex flex-row gap-2 p-1">
          <BookOpen className="text-primary" />
          <h4>Topic Preference:</h4>
        </div>

        <div className="flex flex-col gap-2 p-2">
            <TopicPreference title="Two Pointers" />
            <TopicPreference title="Dynamic Programming" />
        </div>

      </div>

      {/* Edit Profile Modal */}
      <EditProfile
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfile={userProfile}
      />
    </Card>
  );
}

function TopicPreference({ title }: { title: string }) {
    return(
        <Card>
            <div className="flex flex-wrap gap-2">
                <label
                className="px-3 py-1 rounded-md bg-background-200 text-primary"
                >{title}</label>
            </div>
        </Card>
    )
}