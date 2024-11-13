import { Card } from "@/components/ui/card";
import { BookOpen, CodeXml, Mail } from "lucide-react";
import { getCurrentUser } from "@/services/userService";
import { UserProfileResponse } from "@/types/User";
import { UserProfile } from "@/types/User";
import EditProfileButton from "./EditProfileButton";
import { ProfileCard } from "./ProfileCard";

export default async function SideContents() {
  const profileResponse: UserProfileResponse = await getCurrentUser(); 
  if (!profileResponse.data) {
    return <div>Unable to load user profile</div>;
  }

  const profileDetails: UserProfile = profileResponse.data

  return (
    <Card className="p-4 w-full max-w-xs rounded-lg">
      <ProfileCard userProfile={profileDetails} />

      <div className="flex flex-col gap-2 mb-6">
        <EditProfileButton userProfileDetails={profileDetails} />
        {/* <button className="bg-primary text-sm font-semibold py-2 rounded-md">
          Change Password
        </button> */}
      </div>

      {/* User Info */}
      <div>
        <div className="flex flex-row gap-2 p-1">
          <Mail className="text-primary" />
          <h4>Email:</h4>
          <h4 className="text-card-foreground-100">{profileDetails.email}</h4>
        </div>

        <div className="flex flex-row gap-2 p-1">
          <CodeXml className="text-primary" />
          <h4>Language:</h4>
          <h4 className="text-card-foreground-100">
            {profileDetails.languages.join(", ")}
          </h4>
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
      {/* <EditProfile
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userProfile={userProfile}
      /> */}
    </Card>
  );
}

function TopicPreference({ title }: { title: string }) {
  return (
    <Card>
      <div className="flex flex-wrap gap-2">
        <label className="px-3 py-1 rounded-md bg-background-200 text-primary">
          {title}
        </label>
      </div>
    </Card>
  );
}
