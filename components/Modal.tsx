import React from 'react';
import { View, Modal, TouchableOpacity, Text, } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { modalStyles as styles } from '@/assets/styles/css';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
    isFormValid: boolean;
    submitButtonText?: string; // Optional prop for custom submit button text
}

const CustomModal: React.FC<CustomModalProps> = ({ visible, onClose, onSubmit, children, isFormValid, submitButtonText = 'Submit' }) => {    
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/* Close Modal Button */}
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <FontAwesome name="times" size={20} color="gray" />
                    </TouchableOpacity>

                    {/* Dynamic Content */}
                    {children}

                    {/* Add Customer Button */}
                    <TouchableOpacity style={[styles.popupAddBtn, { opacity: isFormValid ? 1 : 0.5 }]} disabled={!isFormValid} onPress={onSubmit}>
                        <Text style={styles.popupAddButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;
