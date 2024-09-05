import React from "react";
import { useRouter, Stack } from "expo-router";
import { LoaderProvider } from "@/providers/LoaderProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import { MenuProvider } from 'react-native-popup-menu';
import { Pressable, Image, Text } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <LoaderProvider>
        <ToastProvider>
          <MenuProvider>
            <Stack>
              {/* Show Index Screen first */}
              <Stack.Screen name="index" options={{ headerShown: false }} />
              {/* Define other screens */}
              <Stack.Screen name="Login" options={{ headerShown: false }} />
              <Stack.Screen name="admin/Customers" options={{ headerShown: false }} />
              {/* <Stack.Screen name="CustomerDetail" options={{ headerShown: true }} /> */}
              <Stack.Screen name="CustomerDetail"
                options={{
                  headerShown: true,
                  title: "Customer Details", // Customize the title
                  headerStyle: {
                    backgroundColor: "#fff", // Customize the background color
                  },
                  headerTintColor: "#000", // Customize the text and icon color
                  headerTitleStyle: {
                    fontWeight: "bold", // Customize the title text style
                  },
                  // Add custom buttons/actions in the header
                  headerRight: () => (
                    <Pressable onPress={() => alert("This is a custom action!")}
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                        },
                        {
                          borderRadius: 8,
                          padding: 6,
                        }, ,
                      ]}>
                      <Text>Info</Text>
                    </Pressable>
                  ),
                  headerLeft: () => (
                    <Pressable onPress={() => router.back()} style={({ pressed }) => [
                      {
                        backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'grey',
                      },
                      {
                        borderRadius: 8,
                        padding: 6,
                      }, ,
                    ]}>
                      <Text>Info</Text>
                    </Pressable>
                  ),
                  headerTitle: () => (
                    <Image
                      source={require("../assets/images/react-logo.png")}
                      style={{ width: 100, height: 40 }}
                      resizeMode="contain"
                    />
                  ),
                }}
              />
            </Stack>
          </MenuProvider>
        </ToastProvider>
      </LoaderProvider >
    </SafeAreaProvider>
  );
}
