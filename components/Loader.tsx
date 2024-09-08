import { loaderStyles as styles } from '@/assets/styles/css';
import React from 'react';
import { View, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Loader: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) {
    return null; // Return null when not visible to prevent rendering an empty modal
  }

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.loaderContainer}>
        {/* GIF Loader */}
        <Image
          source={require('@/assets/images/gifLoader.gif')} // Update this with the path to your GIF
          style={{ width: 70, height: 70 }} // Customize the size of the GIF
          resizeMode="contain" // This ensures the GIF scales properly
        />
      </View>
    </Modal>
  );
};

export default Loader;