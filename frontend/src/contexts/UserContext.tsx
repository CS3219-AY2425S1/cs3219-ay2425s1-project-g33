"use client";

import {
  AccessToken,
  AccessTokenPayload,
  AccessTokenPayloadSchema,
} from "@/types/Token";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";

const UserContext = createContext<AccessTokenPayload | undefined>(undefined);

export function UserProvider({ children }: PropsWithChildren) {
  // TODO: Once User Service is implemented on the backend, fetch user profile
  const [user, setUser] = useState<AccessTokenPayload>();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = parseJwt(token);
      setUser(decoded);
    }
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}

function parseJwt(token: AccessToken): AccessTokenPayload {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return AccessTokenPayloadSchema.parse(JSON.parse(jsonPayload));
}
