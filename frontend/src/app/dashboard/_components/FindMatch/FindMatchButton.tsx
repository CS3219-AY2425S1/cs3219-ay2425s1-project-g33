import { FindMatchProvider } from "@/contexts/FindMatchContext";

import ControlButton from "./ControlButton";
import ConfigurationPanel from "./ConfigurationPanel";
import ConfirmationDialog from "./ConfirmationDialog";
import { getQuestionCategories } from "@/services/questionService";
import { DifficultyEnum } from "@/types/Question";
import { getCurrentUser } from "@/services/userService";
import { UserProfileResponse, UserProfileSchema } from "@/types/User";
import ContinueDialog from "./ContinueDialog";
import { getUserSessionHistory } from "@/services/collaborationService";
import {
  SessionHistory,
  SessionHistoryData,
  SessionHistoryDataSchema,
} from "@/types/SessionInfo";
import RejoinSessionButton from "./RejoinButton";

export default async function FindMatchButton() {
  const user: UserProfileResponse = await getCurrentUser();
  const categoriesResponse = await getQuestionCategories();
  const userSessionHistory = await getUserSessionHistory();

  if (!user || !user.data) {
    return <div>You are not signed in</div>;
  }

  const userData = UserProfileSchema.parse(user.data);

  let categories = [];

  if (categoriesResponse.statusCode === 200 && categoriesResponse.data) {
    categories = categoriesResponse.data.categories;
  }

  let usersActiveSession: SessionHistoryData = [];
  if (userSessionHistory.statusCode === 200 && userSessionHistory.data) {
    const userSessionHistoryData = SessionHistoryDataSchema.parse(
      userSessionHistory.data
    );
    usersActiveSession = userSessionHistoryData.filter(
      (session: SessionHistory) => session.status === "active"
    );
  }

  const socketUrl = process.env.PUBLIC_WEBSOCKET_URL || "ws://localhost:4000";

  return (
    // Not the right way to parse the user data
    <FindMatchProvider socketUrl={`${socketUrl}/match`} userId={userData.id}>
      {usersActiveSession.length > 0 ? (
        <RejoinSessionButton sessionId={usersActiveSession[0].sessionId} />
      ) : (
        <ControlButton />
      )}
      <ConfigurationPanel
        difficulties={DifficultyEnum.options}
        topics={categories}
      />
      <ContinueDialog />
      <ConfirmationDialog user={userData} />
    </FindMatchProvider>
  );
}
