import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getCurrentUser, signOut } from "@/lib/appwrite";
import { useLoader } from '@/providers/LoaderProvider';
import { USE_ASYNC_STORAGE } from '@/config';

const SessionContext = createContext<{
    isLogged: boolean,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>,
    errorInLoggingIn: boolean,
    setErrorInLoggingIn: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean
} | undefined>(undefined);

const RETRY_ATTEMPTS = 0;
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
                console.log("checkSession try");
                const lastAction = await AsyncStorage.getItem('lastAction');
                
                if (lastAction === 'signedout') {
                    console.log("checkSession try 1.1");
                    setIsLogged(false);
                    setUser(null);
                    return;
                }

                console.log("checkSession try 2");
                if (USE_ASYNC_STORAGE) {
                    console.log("checkSession try 2.1");
                    const localSession = await AsyncStorage.getItem('session');
                    if (localSession) {
                        const sessionData = JSON.parse(localSession);
                        setIsLogged(true);
                        setUser(sessionData);
                        return;
                    }
                }
                
                const response = await fetchSessionWithRetry();
                console.log("checkSession try 3");
                if (response) {
                    console.log("checkSession try 3.1");
                    setIsLogged(true);
                    setUser(response);
                    if (USE_ASYNC_STORAGE) {
                        await AsyncStorage.setItem('session', JSON.stringify(response));
                    }
                    await AsyncStorage.setItem('lastAction', 'signedin');
                } else {
                    throw new Error('No valid session');
                }
            } catch (error: any) {
                console.log("checkSession catch");
                console.error("Session check error:", error);
                setErrorInLoggingIn(true);
                setIsLogged(false);
                setUser(null);
                await signOut();
            } finally {
                console.log("checkSession finally");
                hideLoader();
                setIsLoading(false);
            }
        };
        console.log("checkSession");
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
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
