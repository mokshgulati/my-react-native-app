import React, { useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';
import { indexStyles as styles } from '@/assets/styles/css';

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Redirecting to Login...</Text>
      <Button title="Go to Login" onPress={() => router.push("/Login")} />
    </View>
  );
}
