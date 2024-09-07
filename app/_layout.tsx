import React from "react";
import { Stack } from "expo-router";

import { SessionProvider } from "@/providers/SessionProvider";
import { LoaderProvider } from "@/providers/LoaderProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <LoaderProvider>
        <ToastProvider>
          <MenuProvider>
            <SessionProvider>
              <Stack>
                {/* Show Index Screen first */}
                <Stack.Screen name="index" options={{ headerShown: false }} />

                {/* Define other screens */}
                <Stack.Screen name="Login" options={{ headerShown: false }} />
                <Stack.Screen name="admin/Customers" options={{ headerShown: false }} />
                <Stack.Screen name="CustomerDetail" options={{ headerShown: false }} />
              </Stack>
            </SessionProvider>
          </MenuProvider>
        </ToastProvider>
      </LoaderProvider >
    </SafeAreaProvider>
  );
}
