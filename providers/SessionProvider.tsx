import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { getCurrentUser, signOut } from "@/lib/appwrite";
import { useLoader } from '@/providers/LoaderProvider';
import { USE_ASYNC_STORAGE } from '@/config';
import { Alert } from "react-native";
import { router } from "expo-router";
import { useToast } from "@/providers/ToastProvider";

const SessionContext = createContext<{
    isLogged: boolean,
    setIsLogged: React.Dispatch<React.SetStateAction<boolean>>,
    user: any,
    setUser: React.Dispatch<React.SetStateAction<any>>,
    errorInLoggingIn: boolean,
    setErrorInLoggingIn: React.Dispatch<React.SetStateAction<boolean>>,
    isLoading: boolean,
    logout: () => void,
    handleLogout: () => void
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
    const showToast = useToast(); // Show toast messages

    const logout = useCallback(() => {
        setIsLogged(false);
        setUser(null);
    }, []);

    const handleLogout = () => {
        Alert.alert(
          "Logout",
          "Do you want to log out?",
          [
            {
              text: "No",
              style: "cancel"
            },
            {
              text: "Yes",
              onPress: async () => {
                try {
                  await signOut();
                  logout();
                  router.replace('/');
                } catch (error) {
                  console.error('Error during logout:', error);
                  showToast('Error during logout', 'error');
                }
              }
            }
          ]
        );
      };

    const value = useMemo(() => ({
        isLogged,
        setIsLogged,
        user,
        setUser,
        errorInLoggingIn,
        setErrorInLoggingIn,
        isLoading,
        logout,
        handleLogout
    }), [isLogged, user, errorInLoggingIn, isLoading, logout, handleLogout]);

    useEffect(() => {
        const checkSession = async () => {
            showLoader();
            try {
                console.log("checkSession try");
                const lastAction = await AsyncStorage.getItem('lastAction');
                
                // Do something about users who open the app first time
                const isFirstTime = lastAction === null;
                if (isFirstTime) {
                    console.log("checkSession try 0.1");
                    setIsLogged(false);
                    setUser(null);
                    return;
                }

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
                        console.log("checkSession try 2.1.1", sessionData);
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
            value={value}
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
