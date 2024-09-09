import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import CustomModal from '@/components/Modal';
import { Ionicons } from '@expo/vector-icons';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transactionData: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  // const [date, setDate] = useState('');
  // const [paymentStatus, setPaymentStatus] = useState('');

  const handleSubmit = () => {
    if (isFormValid()) {
      const transactionData = {
        paymentId: Math.floor(Math.random() * 1000000), // Generate a random ID
        paymentAmount: parseFloat(amount),
        paymentDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
        paymentStatus: 'paid'
      };
      onSubmit(transactionData);
      setAmount('');
    }
  };

  const isFormValid = () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    // const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    // const statusRegex = /^(paid|pending|delayed)$/i;

    return amountRegex.test(amount);
    //  && dateRegex.test(date) && statusRegex.test(paymentStatus);
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
        {/* <View style={styles.inputContainer}>
          <Ionicons name="calendar-outline" size={24} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChangeText={setDate}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#555" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Payment Status (paid/pending/delayed)"
            value={paymentStatus}
            onChangeText={setPaymentStatus}
          />
        </View> */}
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