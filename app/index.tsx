import React from 'react';
import { View, Text, Image, Pressable, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { indexStyles as styles } from '@/assets/styles/css'

export default function Index() {
  const router = useRouter();

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
