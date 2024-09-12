import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import CustomModal from '@/components/Modal';
import { Ionicons } from '@expo/vector-icons';
import { useLoader } from '@/providers/LoaderProvider';
import { Payment } from '@/lib/appwrite';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (transactionData: Payment) => void;
  initialData?: Payment;
  isEditing?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ visible, onClose, onSubmit, initialData, isEditing = false }) => {
  const [amount, setAmount] = useState('');
  const [dateTimeString, setDateTimeString] = useState('');

  const { showLoader, hideLoader } = useLoader();

  const formatDateTimeForDisplay = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${year}-${month}-${day} ${displayHours}:${minutes} ${ampm}`;
  };

  const formatDateTimeForISO = (displayString: string): string => {
    const [datePart, timePart, ampm] = displayString.split(' ');
    let [hours, minutes] = timePart.split(':');
    let hoursNum = parseInt(hours, 10);

    // Adjust hours for PM
    if (ampm === 'PM' && hoursNum !== 12) {
      hoursNum += 12;
    }
    // Adjust for midnight (12 AM)
    else if (ampm === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }

    hours = String(hoursNum).padStart(2, '0');
    return `${datePart}T${hours}:${minutes}:00`;
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    return formatDateTimeForDisplay(now.toISOString());
  };

  useEffect(() => {
    if (visible) {
      if (initialData) {
        setAmount(initialData.paymentAmount.toString());
        setDateTimeString(formatDateTimeForDisplay(initialData.paymentDate));
      } else {
        setAmount('');
        setDateTimeString(getCurrentDateTime());
      }
    }
  }, [visible, initialData]);

  const handleSubmit = async () => {
    if (isFormValid()) {
      showLoader();
      const transactionData: Payment = {
        paymentId: initialData ? initialData.paymentId : Math.floor(Math.random() * 1000000),
        paymentAmount: parseFloat(amount),
        paymentDate: formatDateTimeForISO(dateTimeString),
      };
      await new Promise(resolve => resolve(onSubmit(transactionData)));
      hideLoader();
      onClose();
    }
  };

  const isFormValid = () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const dateTimeRegex = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01]) (0?[1-9]|1[0-2]):[0-5]\d (AM|PM)$/;

    const isValidDateTime = (dateTimeStr: string) => {
      if (!dateTimeRegex.test(dateTimeStr)) return false;
      const [dateStr, timeStr] = dateTimeStr.split(' ');
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
    };

    return amountRegex.test(amount) && isValidDateTime(dateTimeString);
  };

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      onSubmit={handleSubmit}
      isFormValid={isFormValid()}
      submitButtonText={isEditing ? "Update Transaction" : "Add Transaction"}
      title={isEditing ? "Edit Transaction" : "Add New Transaction"}
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
            placeholder="Date & Time (YYYY-MM-DD HH:MM AM/PM)"
            value={dateTimeString}
            onChangeText={setDateTimeString}
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