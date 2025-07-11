"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth-service";
import { useToast } from "@/hooks/use-toast";
import { useLogin } from "@/hooks/useLogin";
import { useGetMe } from "@/hooks/useGetMe";

type Tier = {
  id: string;
  name: string;
  nameAr: string;
};

type Address = {
  street?: string;
  address1?: string;
  address2?: string;
  postal?: string;
  city?: string;
  province?: string;
  country?: string;
};

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  memberSince: string;
  membershipLevel: string;
  phone: string;
  registrationDate: string;
  referrerToken: string;
  gender: string;
  metadata: string[];
  address: Address;
  deactivatedAt: string;
  createdAt: string;
  tier: Tier;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { login: loginUser, data } = useLogin();
  const { getMe, data: userData } = useGetMe();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (userData) {
      setUser(userData);
      router.push("/products");
    }
  }, [userData]);

  useEffect(() => {
    // Check if user is authenticated on initial load
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (token == null) {
          setIsLoading(false);
          return;
        } else {
          await getMe(token);
        }
      } catch (error) {
        localStorage.removeItem("auth_token");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string) => {
    setIsLoading(true);
    try {
      const { accessToken } = await loginUser(email);
      if (accessToken && accessToken != undefined && accessToken != null) {
        await getMe(accessToken);
        localStorage.setItem("auth_token", accessToken);
        toast({
          title: "Welcome back!",
          description: `Logged in successfully`,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
    router.push("/login");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
