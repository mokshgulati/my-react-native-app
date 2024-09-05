import React from "react";
import { Stack } from "expo-router";
import { LoaderProvider } from "@/app/providers/LoaderProvider";
import { ToastProvider } from "@/app/providers/ToastProvider";
import { MenuProvider } from 'react-native-popup-menu';

export default function RootLayout() {
  return (
    <LoaderProvider>
      <ToastProvider>
        <MenuProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
          </Stack>
        </MenuProvider>
      </ToastProvider>
    </LoaderProvider>
  );
}
