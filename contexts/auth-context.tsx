import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useCart } from "@/hooks/useCart";
import { toNumber } from "@/utils/to-number";

interface AuthContextType {
  session: Session | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
     const { loadCart, userId, authToken, cart } = useCart();
  console.log("this is the user id: ", session)
  
  useEffect(() => {
    if (session?.user && session.wpToken) {
      const userId = toNumber(session.user.id);
      const token = session.wpToken;
      const cartStore = useCart.getState();

      cartStore.setUser(userId, token);
      cartStore.loadCart(); // ✅ merge guest cart automatically after login
    }
  }, [session]);



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
