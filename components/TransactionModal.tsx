import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomModal from '@/components/Modal';
import { Ionicons } from '@expo/vector-icons';
import { useLoader } from '@/providers/LoaderProvider';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transactionData: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [dateString, setDateString] = useState('');
  const { showLoader, hideLoader } = useLoader();

  const handleSubmit = async () => {
    if (isFormValid()) {
      showLoader();
      const transactionData = {
        paymentId: Math.floor(Math.random() * 1000000),
        paymentAmount: parseFloat(amount),
        paymentDate: dateString,
      };
      await new Promise(resolve => resolve(onSubmit(transactionData)));
      hideLoader();
      setAmount('');
      setDateString('');
    }
  };

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (visible) {
      setAmount('');
      setDateString(getCurrentDate());
    }
  }, [visible]);

  const isFormValid = () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    
    const isValidDate = (dateStr: string) => {
      if (!dateRegex.test(dateStr)) return false;
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year &&
             date.getMonth() === month - 1 &&
             date.getDate() === day;
    };
  
    return amountRegex.test(amount) && isValidDate(dateString);
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid()}
      submitButtonText="Add Transaction"
      title="Add New Transaction"
    >
      <View style={styles.modalContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="cash-outline" size={24} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={24} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={dateString}
            onChangeText={setDateString}
            keyboardType="numeric"
          />
        </View>
      </View>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
  },
});

export default TransactionModal;