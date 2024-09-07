import React, { createContext, useContext, useEffect, useState } from "react";

import { getCurrentUser } from "@/lib/appwrite";
import { useLoader } from '@/providers/LoaderProvider';

const GlobalContext = createContext<{
    isLogged: boolean,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>,
    errorInLoggingIn: boolean,
    setErrorInLoggingIn: React.Dispatch<React.SetStateAction<boolean>>
} | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const { showLoader, hideLoader } = useLoader(); // Show and hide loader

    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [errorInLoggingIn, setErrorInLoggingIn] = useState(false);

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
                console.log(error);
                setErrorInLoggingIn(true);
            })
            .finally(() => {
                hideLoader();
            });
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLogged,
                setIsLogged,
                user,
                setUser,
                errorInLoggingIn,
                setErrorInLoggingIn
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within a GlobalProvider');
  }
  return context;
};
