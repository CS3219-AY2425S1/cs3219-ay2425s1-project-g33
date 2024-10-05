import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, CodeXml, Glasses, Mail } from "lucide-react";

export default function SideContents() {
    return (
        <Card className="p-4 w-full max-w-xs rounded-lg">
            <ProfileMiniDetailsCard />

            {/* Profile Management */}
            <div className="flex flex-col gap-2 mb-6">
                <button className="bg-primary text-sm font-semibold py-2 rounded-md">Edit Profile</button>
                <button className="bg-primary text-sm font-semibold py-2 rounded-md">Change Password</button>
            </div>

            {/* User Info */}
            <div>
                <div className="flex flex-row gap-2 p-1">
                    <Mail className="text-primary"/>
                    <h4>Email:</h4>
                    <h4 className="text-card-foreground-100">skibidi@sigma.com</h4>
                </div>

                <div className="flex flex-row gap-2 p-1">
                    <Glasses className="text-primary"/>
                    <h4>Proficiency:</h4>
                    <h4 className="text-card-foreground-100">Expert</h4>
                </div>

                <div className="flex flex-row gap-2 p-1">
                    <CodeXml className="text-primary"/>
                    <h4>Language:</h4>
                    <h4 className="text-card-foreground-100">Java</h4>
                </div>

                <div className="flex flex-row gap-2 p-1">
                    <BookOpen className="text-primary"/>
                    <h4>Topic Preference:</h4>
                </div>
            </div>
        </Card>
    );
}
