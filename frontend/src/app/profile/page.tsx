import MainContent from "./_components/MainContent";
import SideContents from "./_components/SideContents";

export default function ProfilePage() {
    return (
        <div className="flex flex-row gap-8 p-4 justify-center">
            <SideContents />
            <MainContent />
        </div>
    )
}