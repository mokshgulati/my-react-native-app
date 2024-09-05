import { toastStyles as styles } from '@/assets/styles/css';
import React, { useState, useEffect } from 'react';
import { Text, Animated, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
  duration?: number;
  onHide?: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, visible, duration = 3000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  let hideTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (visible) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Set a timeout to fade out after the specified duration
        hideTimeout = setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start(() => {
            if (onHide) {
              onHide();
            }
          });
        }, duration);
      });
    }

    return () => {
      // Clear the timeout if the component unmounts or if visible changes
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Animated.View style={[styles.toastContainer, { opacity: fadeAnim }, styles[type]]}>
          <Text style={styles.message}>{message}</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default Toast;
