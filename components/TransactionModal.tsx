import React, { useState } from 'react';
import { View, TextInput, Text } from 'react-native';
import CustomModal from '@/components/Modal';
import { modalStyles as styles } from '@/assets/styles/css';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transactionData: any) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ visible, onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');

  const handleSubmit = () => {
    onSubmit({ amount, date, paymentStatus });
    setAmount('');
    setDate('');
    setPaymentStatus('');
  };

  const isFormValid = amount && date && paymentStatus ? true : false;

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid}
      submitButtonText="Add Transaction"
      title="Add New Transaction"
    >
      <View style={styles.modalContainer}>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
        />
        <TextInput
          style={styles.input}
          placeholder="Payment Status"
          value={paymentStatus}
          onChangeText={setPaymentStatus}
        />
      </View>
    </CustomModal>
  );
};

export default TransactionModal;