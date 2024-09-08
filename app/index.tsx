import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, StatusBar } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { indexStyles as styles } from '@/assets/styles/css'
import { useSession } from '@/providers/SessionProvider';
import { useToast } from '@/providers/ToastProvider';
import { checkIsAdmin, } from '@/utils/auth';

export default function Index() {
  const router = useRouter();
  const showToast = useToast();
  const { isLogged, errorInLoggingIn, user, isLoading } = useSession();

  useEffect(() => {
    const handleSessionError = async () => {
      console.log("errorInLoggingIn: ", errorInLoggingIn);
      if (errorInLoggingIn) {
        showToast('Error in logging in', 'error');
      }
    };

    handleSessionError();
  }, [errorInLoggingIn]);

  if (isLoading) {
    console.log("isLoading: ", isLoading);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' }}>
        <Image source={require('@/assets/images/DKMainLogo.png')} resizeMode="contain" style={{ height: 400, width: 400 }} />
      </SafeAreaView>
    );
  }

  if (isLogged && user) {
    console.log("redirecting to: ", checkIsAdmin(user) ? "/Customers" : "/CustomerDetail");
    return <Redirect href={checkIsAdmin(user) ? "/Customers" : "/CustomerDetail"} />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <StatusBar barStyle="dark-content" />
      {/* Welcome Message */}
      <View style={styles.overlay}>
        <Image source={require('@/assets/images/DKMainLogo.png')} resizeMode="contain" style={{ height: 360, width: 360 }} />
        <View style={styles.buttonWrapper}>
          <Pressable onPress={() => router.replace("/Login?entry=login")}
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
          <Pressable onPress={() => router.replace("/Login?entry=signup")}
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