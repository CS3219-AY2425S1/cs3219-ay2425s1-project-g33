import { getSessionInfo } from "@/services/collaborationService";
import {
  ResizablePanel,
  ResizablePanelGroup,
  ResizableHandle,
} from "@/components/ui/resizable";
import QuestionTabPanel from "@/app/collaboration/_components/Question";
import Chatbox from "../_components/Chat/Chatbox";
import { redirect } from "next/navigation";
import { getQuestion } from "@/services/questionService";
import { SessionInfoSchema } from "@/types/SessionInfo";
import { QuestionSchema } from "@/types/Question";
import CenterPanel from "../_components/CenterPanel";
import {
  UserProfile,
  UserProfileResponse,
  UserProfileSchema,
} from "@/types/User";
import { getCurrentUser } from "@/services/userService";
import { SessionProvider } from "@/contexts/SessionContext";

type Params = Promise<{ sessionId: string }>;

export default async function Page(props: { params: Params }) {
  const { sessionId } = await props.params;
  // Get session info
  const sessionInfoResponse = await getSessionInfo(sessionId);

  if (sessionInfoResponse.statusCode !== 200 || !sessionInfoResponse.data) {
    redirect("/dashboard");
  }

  const sessionInfo = SessionInfoSchema.parse(sessionInfoResponse.data);

  console.log(sessionInfo);
  console.log(sessionInfo.status == "active");
  if (sessionInfo.status !== "active") {
    redirect("/dashboard");
  }

  // Get user profile
  const userProfileResponse: UserProfileResponse = await getCurrentUser();
  const parsedProfile = UserProfileSchema.safeParse(userProfileResponse.data);

  if (userProfileResponse.statusCode !== 200 || !parsedProfile.success) {
    redirect("/dashboard");
  }

  const userProfile: UserProfile = parsedProfile.data;

  // Get question
  const questionResponse = await getQuestion(sessionInfo.questionId);

  if (questionResponse.statusCode !== 200 || !questionResponse.data) {
    redirect("/dashboard");
  }

  const question = QuestionSchema.parse(questionResponse.data);

  const chatFeature = process.env.NEXT_PUBLIC_CHAT_FEATURE === "true";

  const socketUrl = `${process.env.PUBLIC_WEBSOCKET_URL}/collaboration`;

  return (
    <SessionProvider
      initialSessionId={sessionId}
      initialUserProfile={userProfile}
      question={question}
      socketUrl={socketUrl}
    >
      <div className="flex flex-row w-full h-full overflow-hidden">
        <ResizablePanelGroup
          className="flex w-full h-full"
          direction="horizontal"
        >
          <ResizablePanel className="p-1" defaultSize={30}>
            <QuestionTabPanel question={question} />
          </ResizablePanel>

          <ResizableHandle withHandle={true} />

          <ResizablePanel defaultSize={70}>
            <CenterPanel question={question} />
          </ResizablePanel>
        </ResizablePanelGroup>

        {chatFeature && (
          <div className="flex p-1">
            <Chatbox />
          </div>
        )}
      </div>
    </SessionProvider>
  );
}
