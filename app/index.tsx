import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { indexStyles as styles } from '@/assets/styles/css';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text>Redirecting to Login...</Text>
        <Button title="Go to Login" onPress={() => router.push("/Login")} />
      </View>
    </SafeAreaView>
  );
}
