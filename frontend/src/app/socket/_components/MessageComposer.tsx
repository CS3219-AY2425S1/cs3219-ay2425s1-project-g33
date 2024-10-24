/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { Socket } from "socket.io-client";

export default function MessageComposer() {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [message, setMessage] = useState<string>("");

  function handleSend() {
    if (socket) {
      socket.emit("message", message);
      setMessage("");
    }
  }
  return (
    <div className="flex flex-row gap-4 mt-auto">
      {/* These two can even be broken down further into smaller components, i.e. MessageInput and MessageSendButton */}
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 p-2 border border-black rounded"
      />
      <button
        className="px-4 py-1 border border-black rounded-md"
        onClick={handleSend}
      >
        send
      </button>
    </div>
  );
}
