import React from "react";
import { Stack } from "expo-router";

import { SessionProvider } from "@/providers/SessionProvider";
import { LoaderProvider } from "@/providers/LoaderProvider";
import { ToastProvider } from "@/providers/ToastProvider";

import { MenuProvider } from 'react-native-popup-menu';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { CustomersProvider } from "@/providers/CustomerProvider";

export default function RootLayout() {

  return (
    <SafeAreaProvider>
      <LoaderProvider>
        <ToastProvider>
          <MenuProvider>
            <SessionProvider>
              <CustomersProvider>
              <Stack>
                {/* Show Index Screen first */}
                <Stack.Screen name="index" options={{ headerShown: false }} />

                {/* Define other screens */}
                <Stack.Screen name="Login" options={{ headerShown: false }} />
                <Stack.Screen name="Customers" options={{ headerShown: false }} />
                <Stack.Screen name="CustomerDetail" options={{ headerShown: false }} />
              </Stack>
              </CustomersProvider>
            </SessionProvider>
          </MenuProvider>
        </ToastProvider>
      </LoaderProvider >
    </SafeAreaProvider>
  );
}
