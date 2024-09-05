import { loaderStyles as styles } from '@/assets/styles/css';
import React from 'react';
import { View, ActivityIndicator, Modal } from 'react-native';

const Loader: React.FC<{ visible: boolean }> = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible} >
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    </Modal>
  );
};

export default Loader;
