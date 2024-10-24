import { getCurrentUser } from "@/services/userService";
import { redirect } from "next/navigation";

export default async function WelcomeMessage() {
  const userProfileResponse = await getCurrentUser();

  if (userProfileResponse.statusCode === 401) {
    redirect("/auth/signin");
  }

  if (!userProfileResponse.data) {
    return <div>{userProfileResponse.message}</div>;
  }

  return (
    <h1 className="text-xl font-bold">
      Welcome Back, {userProfileResponse.data.displayName}!
    </h1>
  );
}
