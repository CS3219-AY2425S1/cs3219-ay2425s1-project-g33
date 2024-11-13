"use client";

import { useEffect, useMemo, useState } from "react";
import { WebsocketProvider } from "y-websocket";

interface AwarenessUser {
  name: string;
  color: string;
}

type AwarenessList = [number, AwarenessUser][];

interface InjectableCursorStylesProps {
  yProvider: WebsocketProvider;
  cursorName: string;
  cursorColor: string;
}

export default function InjectableCursorStyles({
  yProvider,
  cursorName,
  cursorColor,
}: InjectableCursorStylesProps) {
  const [awarenessUsers, setAwarenessUsers] = useState<AwarenessList>([]);

  // Set up current user's presence and also update whenever remote client submits its own presence
  useEffect(() => {
    const awareness = yProvider.awareness;

    // TODO: make this dynamic with the context api and choose random hex colors
    awareness.setLocalStateField("user", {
      name: cursorName,
      color: cursorColor,
      // color: "#0096C7",
    });

    const updateAwarenessUsers = () => {
      const states = awareness.getStates(); // Get all user states
      const users: AwarenessList = [];
      states.forEach((val, key) => {
        users.push([key, val.user]);
      });

      setAwarenessUsers(users);
    };

    // Attach change event listener
    awareness.on("change", updateAwarenessUsers);
    updateAwarenessUsers();

    return () => {
      awareness.off("change", updateAwarenessUsers);
    };
  }, [yProvider, cursorName, cursorColor]);

  const styleSheet = useMemo(() => {
    let cursorStyles = "";

    awarenessUsers.forEach((client) => {
      const clientId = client[0] || 0;
      const clientData = client[1] || {
        name: "Unknown",
        color: "#0096C7",
      };

      console.log(client, client[0], client[1]);
      cursorStyles += `
          .yRemoteSelection-${clientId},
          .yRemoteSelectionHead-${clientId}  {
            --user-color: ${clientData.color};
          }

          .yRemoteSelectionHead-${clientId}::after {
            content: "${clientData.name}";
          }
        `;
    });

    return { __html: cursorStyles };
  }, [awarenessUsers]);

  return <style dangerouslySetInnerHTML={styleSheet} />;
}
