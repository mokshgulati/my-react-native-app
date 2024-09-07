import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const RETRY_ATTEMPTS = 1;
const TIMEOUT = 5000; // 5 seconds

const fetchSessionWithRetry = async (retries = RETRY_ATTEMPTS) => {
    try {
        const sessionPromise = getCurrentUser();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), TIMEOUT)
        );
        return await Promise.race([sessionPromise, timeoutPromise]);
    } catch (error) {
        if (retries > 0) {
            console.log('Retrying session check...');
            return fetchSessionWithRetry(retries - 1);
        } else {
            throw new Error('Failed to retrieve session after multiple attempts');
        }
    }
};

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const { showLoader, hideLoader } = useLoader();

    const [isLogged, setIsLogged] = useState(false);
    const [user, setUser] = useState(null);
    const [errorInLoggingIn, setErrorInLoggingIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            showLoader();
            try {
                const localSession = await AsyncStorage.getItem('session');
                if (localSession) {
                    const sessionData = JSON.parse(localSession);
                    setIsLogged(true);
                    setUser(sessionData);
                } else {
                    const res = await fetchSessionWithRetry();
                    if (res) {
                        setIsLogged(true);
                        setUser(res);
                        await AsyncStorage.setItem('session', JSON.stringify(res));
                    } else {
                        throw new Error('No valid session');
                    }
                }
            } catch (error: any) {
                console.error("Session check error:", error);
                setErrorInLoggingIn(true);
                await signOut();
            } finally {
                hideLoader();
                setIsLoading(false);
            }
        };

        checkSession();
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
