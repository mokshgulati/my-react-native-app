import React from 'react';
import { View, Modal, TouchableOpacity, Text, ScrollView } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { modalStyles as styles } from '@/assets/styles/css';

interface CustomModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    children: React.ReactNode;
    isFormValid: boolean;
    submitButtonText?: string;
    title: string;
}

const CustomModal: React.FC<CustomModalProps> = ({ 
    visible, 
    onClose, 
    onSubmit, 
    children, 
    isFormValid, 
    submitButtonText = 'Submit',
    title
}) => {    
    return (
        <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <FontAwesome name="times" size={20} color="#555" />
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={styles.modalBody}>
                        {children}
                    </ScrollView>
                    <View style={styles.modalFooter}>
                        <TouchableOpacity 
                            style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]} 
                            disabled={!isFormValid} 
                            onPress={onSubmit}
                        >
                            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomModal;
