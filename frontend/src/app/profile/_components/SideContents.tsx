import { ProfileMiniDetailsCard } from "@/components/ProfileMiniDetailsCard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BookOpen, CodeXml, Glasses, Mail } from "lucide-react";

// SideContents Component
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

// AvatarWrapper Component (same as you have)
function AvatarWrapper({ src, name, className }: { src: string | null; name: string; className?: string }) {
    function getInitialsFromName(name: string) {
        const chunks = name.split(" ");
        const initials = chunks.map((chunk) => chunk[0]).join("");
        return initials.toUpperCase();
    }

    return (
        <div className={`w-20 h-20 rounded-full bg-gray-500 flex items-center justify-center text-xl font-bold text-white ${className}`}>
            {src ? <img src={src} alt={name} className="rounded-full" /> : getInitialsFromName(name)}
        </div>
    );
}

// ProfileItem Component
function ProfileItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center mb-3">
            <p className="text-secondary font-semibold">{label}:</p>
            <p className="text-primary">{value}</p>
        </div>
    );
}
