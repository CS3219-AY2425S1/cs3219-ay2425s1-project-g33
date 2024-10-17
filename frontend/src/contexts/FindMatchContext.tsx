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
import { ZodAny } from "zod";

interface FindMatchContextProps {
  isConnected: boolean;
  match?: string;
  findingMatch: boolean;
  matchFound: boolean;
  isAwaitingConfirmation: boolean;
  showConfigurationPanel: boolean;
  difficulties: Difficulty[];
  topics: Category[];
  handleFindMatch: () => void;
  handleCancelMatch: () => void;
  handleAcceptMatch: () => void;
  handleDeclineMatch: () => void;
  setShowConfigurationPanel: (show: boolean) => void;
  setDifficulty: (difficulty: Difficulty[]) => void;
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

  const [difficulty, setDifficulty] = useState<Difficulty[]>([
    DifficultyEnum.enum.Medium,
  ]);

  const [showConfigurationPanel, setShowConfigurationPanel] = useState(false);

  const [topics, setTopics] = useState<Category[]>(["Array"]);
  const [isConnected, setIsConnected] = useState(false);

  const [findingMatch, setFindingMatch] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [isAwaitingConfirmation, setIsAwaitingConfirmation] = useState(false);

  const [matchId, setMatchId] = useState<string | undefined>();

  const matchRequest: MatchRequest = useMemo(() => {
    return {
      userId: userId,
      selectedDifficulty: difficulty[0],
      selectedTopic: topics,
    };
  }, [userId, difficulty, topics]);

  const [socket] = useState(
    io(socketUrl, {
      autoConnect: false,
      reconnection: false,
      query: {
        userId: userId,
      },
    })
  );

  const handleFindMatch = useCallback(() => {
    socket.connect();
    socket.once("connected", () => {
      socket.emit("findMatch", matchRequest);
    });
    setFindingMatch(true);
  }, [socket, matchRequest]);

  const handleCancelMatch = useCallback(() => {
    if (!socket.connected) {
      return;
    }

    setFindingMatch(false);
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

  const onMatchFound = useCallback(({ matchId }: { matchId: string }) => {
    setMatchId(matchId);
    setFindingMatch(false);
    setMatchFound(true);
    setIsAwaitingConfirmation(false);
  }, []);

  const onMatchDeclined = useCallback(
    ({ message }: { message: string }) => {
      if (!socket || !socket.connected) {
        return;
      }
      // Return user back to the pool
      if (message.substring(0, 3) == "The") {
        setMatchId(undefined);
        setMatchFound(false);
        setFindingMatch(true);
        socket.emit("findMatch", matchRequest);
      }
    },
    [socket, matchRequest]
  );

  const onMatchConfirmed = useCallback(
    ({ message, sessionId }: { message: string; sessionId: string }) => {
      console.log("Redirect to:", sessionId, message);
      reset();
    },
    []
  );

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("matchFound", onMatchFound);
    socket.on("matchDeclined", onMatchDeclined);
    socket.on("matchConfirmed", onMatchConfirmed);

    socket.on("matchError", (error) => {
      toast({
        title: "Error",
        description: error,
      });
      console.error("Connection error:", error);
    });

    socket.on("exception", (error) => {
      toast({
        title: "Error",
        description: error,
      });
      console.error("Connection error:", error);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      reset();
    });
    return () => {
      socket.off("connect");
      socket.off("matchFound");
      socket.off("matchDeclined");
      socket.off("matchConfirmed");
      socket.off("matchError");
      socket.off("exception");
      socket.off("disconnect");
      socket.disconnect();
    };
  }, [socket, onMatchFound, onMatchDeclined, onMatchConfirmed, toast]);

  // Reset state
  function reset() {
    setMatchId(undefined);
    setFindingMatch(false);
    setMatchFound(false);
    setIsAwaitingConfirmation(false);
  }

  const providerValue: FindMatchContextProps = {
    isConnected,
    match: matchId,
    findingMatch,
    matchFound,
    isAwaitingConfirmation,
    showConfigurationPanel,
    difficulties: difficulty,
    topics,
    handleFindMatch,
    handleCancelMatch,
    handleAcceptMatch,
    handleDeclineMatch,
    setShowConfigurationPanel,
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