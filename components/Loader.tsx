import { loaderStyles as styles } from '@/assets/styles/css';
import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

const Loader: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) {
    return null; // Return null when not visible to prevent rendering an empty modal
  }

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.loaderContainer}>
        <ActivityIndicator 
          size="large" 
          color="black" 
          aria-label="Loading" // Accessibility attribute
          role="progressbar" // Accessibility role
        />
      </View>
    </Modal>
  );
};

export default Loader;
