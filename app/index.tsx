import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, StatusBar } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { indexStyles as styles } from '@/assets/styles/css'
import { useGlobal } from '@/providers/GlobalProvider';
import { useToast } from '@/providers/ToastProvider';

export default function Index() {
  const router = useRouter();
  const showToast = useToast();
  const { isLogged, errorInLoggingIn, user } = useGlobal();

  useEffect(() => {

    console.log("qweqwe", user);

    if (errorInLoggingIn) {
      showToast('Error in logging in', 'error');
    }
  }, [errorInLoggingIn]);

  if (errorInLoggingIn) {
    showToast('Error in logging in', 'error');
  }

  if (isLogged && user) {
    console.log("user login check", user);
    if (user.role === 'admin') {
      return <Redirect href="/admin/Customers" />;
    } else {
      return <Redirect href="/CustomerDetail" />;
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" />
      {/* Welcome Message */}
      <View style={styles.overlay}>
        <Image source={require('@/assets/images/DKMainLogo.png')} resizeMode="contain" style={{ height: 360, width: 360 }} />
        <View style={styles.buttonWrapper}>
          <Pressable onPress={() => router.push("/Login?entry=login")}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'rgb(23,43,109)',
                borderRadius: 8,
                padding: 6,
                width: '100%',
                height: 60,
              },
            ]}>
            <Text style={styles.btnTxt}>LOGIN</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/Login?entry=signup")}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'rgb(23,43,109)',
                borderRadius: 8,
                padding: 6,
                width: '100%',
                height: 60,
              },
            ]}>
            <Text style={styles.btnTxt}>SIGN UP</Text>
          </Pressable>
        </View>
        <Text style={styles.footer}>Copyright @ 2024 | DK Group</Text>
      </View>
    </SafeAreaView>
  );
}