import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();

  return (
    <AuthContext.Provider
      value={{
        session: session ?? null,
        isLoading: status === "loading",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
