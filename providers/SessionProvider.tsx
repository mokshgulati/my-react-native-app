import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser, signOut } from "@/lib/appwrite";
import { useLoader } from '@/providers/LoaderProvider';

const SessionContext = createContext<{
    isLogged: boolean,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>,
    errorInLoggingIn: boolean,
    setErrorInLoggingIn: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean
} | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { showLoader, hideLoader } = useLoader();

    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [errorInLoggingIn, setErrorInLoggingIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        showLoader();
        getCurrentUser()
            .then((res: any) => {
                if (res) {
                    setIsLogged(true);
                    setUser(res);
                } else {
                    setIsLogged(false);
                    setUser(null);
                }
            })
            .catch((error: any) => {
                console.error("errorrrrrr", error);
                setErrorInLoggingIn(true);
                signOut();
            })
            .finally(() => {
                hideLoader();
                setIsLoading(false);
            });
    }, []);

    return (
        <SessionContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                errorInLoggingIn,
                setErrorInLoggingIn,
                isLoading
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
