"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
  // SetStateAction, Dispatch,
} from "react";
import {
  SessionUserProfiles,
  SessionUserProfilesSchema,
  UserProfile,
} from "@/types/User";
import { createCodeReview } from "@/services/collaborationService";
import { CodeReview } from "@/types/CodeReview";
import { io } from "socket.io-client";
import {
  ChatMessage,
  ChatMessages,
  ChatMessageSchema,
  ChatMessagesSchema,
  ChatMessageStatusEnum,
} from "@/types/ChatMessage";
import { v4 as uuidv4 } from "uuid";
import { Question } from "@/types/Question";
import { SubmissionResult } from "@/types/TestResult";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { SessionJoinRequest } from "@/types/SessionInfo";
import { Frown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface SessionContextType {
  connectionStatus: "connecting" | "connected" | "failed";
  sessionId: string;
  sessionUserProfiles: SessionUserProfiles;
  userProfile: UserProfile | null;
  getUserProfileDetailByUserId: (userId: string) => UserProfile | undefined; // all profiles in a session including currUser
  messages: ChatMessage[];
  handleSendMessage: (message: string) => void;
  setSessionId: (sessionId: string) => void;
  setUserProfile: (userProfile: UserProfile) => void;
  language: string;
  changeLanguage: (language: string) => void;
  submitCode: () => void;
  submitting: boolean;
  submissionResult?: SubmissionResult;
  testResultPanel: string;
  setSubmissionResult: (result: SubmissionResult) => void;
  setTestResultPanel: (panel: string) => void;
  endSession: () => void;
  codeReview: {
    isGeneratingCodeReview: boolean;
    currentClientCode: string;
    hasCodeReviewResults: boolean;
    setCurrentClientCode: (code: string) => void;
    codeReviewResult: CodeReview;
    generateCodeReview: () => void;
  };
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  socketUrl: string;
  initialUserProfile: UserProfile;
  initialSessionId: string;
  question: Question;
  children: React.ReactNode;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  socketUrl,
  initialUserProfile,
  initialSessionId,
  question,
  children,
}) => {
  const router = useRouter();
  const { toast } = useToast();

  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "failed"
  >("connecting");
  const [sessionId, setSessionId] = useState<string>(initialSessionId);
  const [sessionUserProfiles, setSessionUserProfiles] =
    useState<SessionUserProfiles>([]);
  const [userProfile, setUserProfile] =
    useState<UserProfile>(initialUserProfile);
  const [messages, setMessages] = useState<ChatMessages>([]);

  const [codeReview, setCodeReview] = useState({
    isGeneratingCodeReview: false,
    currentClientCode: "",
    hasCodeReviewResults: false,
    codeReviewResult: {
      body: "",
      codeSuggestion: "",
    },
  });

  const setCurrentClientCode = useCallback((code: string) => {
    setCodeReview((prev) => ({ ...prev, currentClientCode: code }));
  }, []);

  // TODO: Format code for input to code review
  // const formatCode = useCallback(() => {}, []);

  const generateCodeReview = useCallback(async () => {
    setCodeReview((prev) => ({ ...prev, isGeneratingCodeReview: true }));
    try {
      const response = await createCodeReview(
        sessionId,
        codeReview.currentClientCode
      );
      if (response.statusCode !== 200) {
        throw new Error(response.message);
      }
      console.log(response.data);
      setCodeReview((prev) => ({
        ...prev,
        codeReviewResult: response.data,
        hasCodeReviewResults: true,
      }));
    } catch (error) {
      console.error("Code review generation failed:", error);
    } finally {
      setCodeReview((prev) => ({ ...prev, isGeneratingCodeReview: false }));
    }
  }, [codeReview.currentClientCode, sessionId]);

  const getUserProfileDetailByUserId = useCallback(
    (userId: string) => {
      return sessionUserProfiles.find((profile) => profile.id === userId);
    },
    [sessionUserProfiles]
  );

  const socket = useMemo(() => {
    return io(socketUrl, {
      autoConnect: false,
      reconnection: false,
    });
  }, [socketUrl]);

  const handleSendMessage = useCallback(
    (message: string) => {
      if (!socket.connected) return;

      const newMessage: ChatMessage = {
        id: uuidv4(),
        userId: userProfile.id,
        sessionId,
        message,
        status: ChatMessageStatusEnum.enum.sending,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      socket.emit("chatSendMessage", newMessage);
    },
    [sessionId, socket, userProfile.id]
  );

  const handleJoinSession = useCallback(
    (payload: SessionJoinRequest) => {
      if (!socket.connected) return;
      socket.emit("sessionJoin", payload);
    },
    [socket]
  );

  const onSessionJoined = useCallback(
    ({
      userId,
      language,
      sessionMessages,
      sessionUserProfiles,
    }: {
      userId: string;
      language: string;
      sessionMessages: ChatMessages;
      sessionUserProfiles: SessionUserProfiles;
    }) => {
      console.log("sessionJoined occured");
      try {
        if (userProfile.id === userId) {
          setConnectionStatus("connected");
          const currentMessages = ChatMessagesSchema.parse(
            sessionMessages.map((message: ChatMessage) => ({
              ...message,
              status: ChatMessageStatusEnum.enum.sent,
            }))
          );

          setMessages([...currentMessages]);
        }

        _setLanguage(language);
        const currentSessionUserProfiles =
          SessionUserProfilesSchema.parse(sessionUserProfiles);
        setSessionUserProfiles([...currentSessionUserProfiles]);
      } catch (e) {
        console.log(e);
      }
    },
    [userProfile.id]
  );

  const onChatReceiveMessage = useCallback(
    (newMessage: ChatMessage) => {
      console.log("chatReceiveMessage occured");
      try {
        newMessage["status"] = ChatMessageStatusEnum.enum.sent;
        const messageParsed = ChatMessageSchema.parse(newMessage);

        if (messageParsed.userId === userProfile.id) {
          // set the loclly sent message
          setMessages((prev) =>
            prev.map((message) => {
              if (message.id !== messageParsed.id) return message;
              return {
                ...message,
                status: ChatMessageStatusEnum.enum.sent,
              };
            })
          );
          return;
        }

        setMessages((prev) => [...prev, messageParsed]);
      } catch (e) {
        console.log(e);
      }
    },
    [userProfile.id]
  );

  const onSessionLeft = useCallback(
    ({
      sessionUserProfiles,
    }: {
      userId: string;
      sessionUserProfiles: string;
    }) => {
      try {
        console.log("sessionLeft occured");

        const currentSessionUserProfiles =
          SessionUserProfilesSchema.parse(sessionUserProfiles);
        setSessionUserProfiles([...currentSessionUserProfiles]);

        console.log(userProfile);
      } catch (e) {
        console.error(e);
      }
    },
    [userProfile]
  );

  const [submitting, setSubmitting] = useState(false);

  const [submissionResult, setSubmissionResult] = useState<SubmissionResult>();

  const [testResultPanel, setTestResultPanel] = useState("test-cases");

  const [language, _setLanguage] = useState("python3");

  const changeLanguage = useCallback(
    (language: string) => {
      socket.emit("changeLanguage", {
        userId: userProfile.id,
        sessionId: sessionId,
        language,
      });
    },
    [sessionId, socket, userProfile.id]
  );

  const onLanguageChanged = useCallback(
    ({ language }: { changedBy: string; language: string }) => {
      _setLanguage(language);
    },
    []
  );

  const submitCode = useCallback(() => {
    if (submitting) {
      return;
    }

    if (!socket.connected) {
      return;
    }

    socket.emit("submit", {
      userId: userProfile.id,
      sessionId: sessionId,
      questionId: question._id,
      code: codeReview.currentClientCode,
      language: language,
    });
  }, [
    submitting,
    socket,
    userProfile.id,
    sessionId,
    question._id,
    codeReview.currentClientCode,
    language,
  ]);

  const onSubmitting = useCallback(({}: { message: string }) => {
    setSubmitting(true);
  }, []);

  const onSubmitted = useCallback(
    async ({
      submissionResult,
    }: {
      message: string;
      submissionResult: SubmissionResult;
    }) => {
      setSubmissionResult(submissionResult);

      console.log(submissionResult);

      setSubmitting(false);

      setTestResultPanel("test-result");
    },
    []
  );

  const endSession = useCallback(() => {
    socket.emit("sessionEnd", {
      userId: userProfile.id,
      sessionId,
    });
  }, [sessionId, socket, userProfile.id]);

  const onSessionEnded = useCallback(
    ({ endedBy }: { endedBy: string; message: string }) => {
      toast({
        title: "Session ended",
        description: `${
          userProfile.id === endedBy
            ? "You have ended the session"
            : "The other user has ended the session"
        }, you will be redirected to the dashboard shortly.`,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
    },
    [toast, userProfile.id, router]
  );

  const onSessionError = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({
      event,
      data,
      error,
    }: {
      event: string;
      data: undefined | { id: string; timestamp: string };
      error: string;
    }) => {
      console.log(`Session Error received ${error}`);

      if (event === "sessionJoin") {
        setConnectionStatus("failed");
      }

      if (event === "chatSendMessage") {
        setMessages((prev) =>
          prev.map((message) => {
            if (message.id !== data?.id) return message;
            return {
              ...message,
              status: ChatMessageStatusEnum.enum.failed,
            };
          })
        );
      }
    },
    []
  );

  // connect to the session socket on mount
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      handleJoinSession({
        userId: userProfile.id,
        sessionId,
      });
    });

    socket.on("sessionJoined", onSessionJoined);

    socket.on("sessionLeft", onSessionLeft);

    socket.on("chatReceiveMessage", onChatReceiveMessage);

    socket.on("languageChanged", onLanguageChanged);

    socket.on("submitting", onSubmitting);
    socket.on("submitted", onSubmitted);

    socket.on("sessionEnded", onSessionEnded);
    socket.on("sessionError", onSessionError);

    return () => {
      socket.emit("sessionLeave", {
        userId: userProfile.id,
        sessionId,
      });
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [
    onSubmitted,
    onSubmitting,
    sessionId,
    socket,
    userProfile,
    handleJoinSession,
    onChatReceiveMessage,
    onSessionJoined,
    onSessionLeft,
    onLanguageChanged,
    onSessionEnded,
    onSessionError,
  ]);

  const contextValue: SessionContextType = useMemo(
    () => ({
      connectionStatus,
      sessionId,
      setSessionId,
      sessionUserProfiles,
      getUserProfileDetailByUserId,
      userProfile,
      setUserProfile,
      messages,
      setMessages,
      handleSendMessage,
      language,
      changeLanguage,
      submitCode,
      submitting,
      submissionResult,
      testResultPanel,
      setTestResultPanel,
      setSubmissionResult,
      endSession,
      codeReview: {
        ...codeReview,
        setCurrentClientCode,
        generateCodeReview,
      },
    }),
    [
      connectionStatus,
      sessionId,
      sessionUserProfiles,
      getUserProfileDetailByUserId,
      userProfile,
      messages,
      handleSendMessage,
      language,
      changeLanguage,
      submitCode,
      submitting,
      submissionResult,
      testResultPanel,
      endSession,
      codeReview,
      setCurrentClientCode,
      generateCodeReview,
    ]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {connectionStatus === "connected" ? (
        children
      ) : connectionStatus === "connecting" ? (
        <LoadingSessionComponent />
      ) : (
        <LoadingErrorSessionComponent />
      )}
    </SessionContext.Provider>
  );
};

export const useSessionContext = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useCodeContext must be used within a CodeProvider");
  }
  return context;
};

// Ideally should be extracted as a generic component
function LoadingSessionComponent() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5">
      <LoadingSpinner />
      <p>Joining the collaboration session...</p>
    </div>
  );
}

function LoadingErrorSessionComponent() {
  const router = useRouter();

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5">
      <Frown size={50} />
      <div className="text-center">
        <p>Something went wrong while joining the session.</p>
        <p>Please try again or find another match.</p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={() => window.location.reload()}>Try Again</Button>
        <Button
          variant="secondary"
          onClick={() => router.replace("/dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
