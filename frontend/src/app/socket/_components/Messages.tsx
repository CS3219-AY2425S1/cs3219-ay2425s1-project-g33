/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import Message from "./Message";
import { io, Socket } from "socket.io-client";

export default function Messages() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");

  const [messages, setMessages] = useState<string[]>(["hello", "world"]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      setIsConnected(true);
      setTransport(newSocket.io.engine.transport.name); // You can set transport type here
    });

    newSocket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    // Cleanup function to disconnect the socket when the component unmounts
    return () => {
      newSocket.disconnect();
    };
  }, []); // Only run on mount/unmount

  return (
    <div className="flex flex-col">
      {messages.map((message, index) => (
        <Message key={index} text={message} />
      ))}
    </div>
  );
}
