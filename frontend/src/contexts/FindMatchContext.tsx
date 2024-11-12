"use client";

import {
  PropsWithChildren,
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { io } from "socket.io-client";
import { Difficulty, DifficultyEnum } from "@/types/Question";
import { Category } from "@/types/Category";
import { MatchRequest } from "@/types/Match";
import { useToast } from "@/hooks/use-toast";

import { useInterval } from "usehooks-ts";
import { useRouter } from "next/navigation";

interface FindMatchContextProps {
  isConnected: boolean;
  matchId?: string;
  matchUsername?: string;
  matchDisplayname?: string;
  findingMatch: boolean;
  matchFound: boolean;
  isAwaitingConfirmation: boolean;
  showConfigurationPanel: boolean;
  showContinueDialog: boolean;
  timer: number;
  difficulties: Difficulty;
  topics: Category[];
  handleFindMatch: () => void;
  handleCancelMatch: () => void;
  handleAcceptMatch: () => void;
  handleDeclineMatch: () => void;
  setShowConfigurationPanel: (show: boolean) => void;
  setShowContinueDialog: (show: boolean) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  setTopics: (topics: Category[]) => void;
}

interface FindMatchProviderProps {
  socketUrl: string;
  userId: string;
}

const MatchContext = createContext<FindMatchContextProps | undefined>(
  undefined
);

export function FindMatchProvider({
  socketUrl,
  userId,
  children,
}: PropsWithChildren<FindMatchProviderProps>) {
  const { toast } = useToast();
  const router = useRouter();

  const [difficulty, setDifficulty] = useState<Difficulty>(
    DifficultyEnum.enum.Medium
  );

  const [topics, setTopics] = useState<Category[]>(["Array"]);

  const [showConfigurationPanel, setShowConfigurationPanel] = useState(false);
  const [showContinueDialog, setShowContinueDialog] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [findingMatch, setFindingMatch] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

  const [timer, setTimer] = useState(0);

  useInterval(
    () => {
      setTimer(timer + 1);
    },
    findingMatch ? 1000 : null
  );

  const [matchId, setMatchId] = useState<string | undefined>();

  const [matchUsername, setMatchUsername] = useState<string | undefined>();

  const [matchDisplayname, setMatchDisplayname] = useState<
    string | undefined
  >();

  const matchRequest: MatchRequest = useMemo(() => {
    return {
      userId: userId,
      selectedDifficulty: difficulty,
      selectedTopic: topics,
    };
  }, [userId, difficulty, topics]);

  const socket = useMemo(() => {
    return io(socketUrl, {
      autoConnect: false,
      reconnection: false,
      query: {
        userId: userId,
      },
    });
  }, [socketUrl, userId]);

  const handleFindMatch = useCallback(() => {
    socket.connect();
    socket.once("connected", () => {
      socket.emit("findMatch", matchRequest);
      socket.once("matchRequested", () => {
        setFindingMatch(true);
      });
    });
  }, [socket, matchRequest]);

  const handleCancelMatch = useCallback(() => {
    if (!socket.connected) {
      return;
    }

    setFindingMatch(false);
    setTimer(0);

    socket.emit("cancelMatch", { userId });
    socket.once("matchCancelled", () => {
      socket.disconnect();
    });
    reset();
  }, [socket, userId]);

  const handleAcceptMatch = useCallback(() => {
    if (!socket.connected) {
      return;
    }

    setTimeout(() => {
      socket.emit("acceptMatch", { userId, matchId });
    }, 500);
    setIsAwaitingConfirmation(true);
  }, [socket, userId, matchId]);

  const handleDeclineMatch = useCallback(() => {
    if (!socket.connected) {
      return;
    }

    socket.emit("declineMatch", { userId, matchId });

    socket.once("matchDeclined", () => {
      socket.disconnect();
      reset();
    });
  }, [socket, userId, matchId]);

  const onMatchFound = useCallback(
    ({
      matchId,
      matchUsername,
      matchDisplayname,
    }: {
      matchId: string;
      matchUsername: string;
      matchDisplayname: string;
    }) => {
      setMatchId(matchId);
      setMatchUsername(matchUsername);
      setMatchDisplayname(matchDisplayname);
      setFindingMatch(false);
      setMatchFound(true);
      setIsAwaitingConfirmation(false);
      setTimer(0);
    },
    []
  );

  const onMatchDeclined = useCallback(
    ({ message }: { message: string }) => {
      if (!socket || !socket.connected) {
        return;
      }

      // Return user back to the pool
      if (message.substring(0, 3) == "The") {
        toast({
          title: "Match Declined",
          description:
            "You will be returned to the pool to find another match.",
        });
        setMatchId(undefined);
        setMatchFound(false);
        setFindingMatch(true);
        socket.emit("findMatch", matchRequest);
      }
    },
    [socket, matchRequest, toast]
  );

  const onMatchConfirmed = useCallback(
    ({ message, sessionId }: { message: string; sessionId: string }) => {
      toast({
        title: "Match Confirmed",
        description: `You should be redirected to /${sessionId}`,
      });
      console.log("Redirect to:", sessionId, message);
      reset();
      router.push(`/collaboration/${sessionId}`);
    },
    [router, toast]
  );

  const handleError = useCallback(
    (error: string) => {
      toast({
        title: "Error",
        description: error,
      });
      socket.disconnect();
    },
    [socket, toast]
  );

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("matchFound", onMatchFound);
    socket.on("matchDeclined", onMatchDeclined);
    socket.on("matchConfirmed", onMatchConfirmed);

    socket.on("matchError", handleError);
    socket.on("exception", handleError);

    socket.on("disconnect", () => {
      setIsConnected(false);
      reset();
    });
    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, [
    socket,
    onMatchFound,
    onMatchDeclined,
    onMatchConfirmed,
    handleError,
    toast,
  ]);

  useEffect(() => {
    if (findingMatch) {
      const timer = setTimeout(() => {
        handleCancelMatch();
        setShowContinueDialog(true);
      }, 30000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [findingMatch, handleCancelMatch]);

  // Reset state
  function reset() {
    setMatchId(undefined);
    setFindingMatch(false);
    setMatchFound(false);
    setIsAwaitingConfirmation(false);
    setTimer(0);
  }

  const providerValue: FindMatchContextProps = {
    isConnected,
    matchId,
    matchUsername,
    matchDisplayname,
    findingMatch,
    matchFound,
    isAwaitingConfirmation,
    showConfigurationPanel,
    showContinueDialog,
    timer,
    difficulties: difficulty,
    topics,
    handleFindMatch,
    handleCancelMatch,
    handleAcceptMatch,
    handleDeclineMatch,
    setShowConfigurationPanel,
    setShowContinueDialog,
    setDifficulty,
    setTopics,
  };

  return (
    <MatchContext.Provider value={providerValue}>
      {children}
    </MatchContext.Provider>
  );
}

export function useFindMatchContext() {
  const context = useContext(MatchContext);
  if (!context) {
    throw new Error("useFindMatchContext must be used within a MatchProvider");
  }
  return context;
}
