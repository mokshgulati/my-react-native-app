import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useLoader } from '@/app/providers/LoaderProvider';
import { useToast } from '@/app/providers/ToastProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { customerDetailStyles as styles } from '@/assets/styles/css';

interface CustomerDetailsProps {
  customerId: number,
  handleBackFromDetails: () => void,
  type: string | undefined
}

export default function CustomerDetails({ customerId, handleBackFromDetails, type }: CustomerDetailsProps) {

  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();

  const [details, setDetails] = useState({
    basicDetails: {
      name: "",
      email: "",
      phone: "",
      amount: "",
      status: true
    },
    payments: [
      {
        id: 0,
        amount: '',
        date: "",
        paymentStatus: ""
      },
      {
        id: 1,
        amount: '',
        date: "",
        paymentStatus: ""
      },
      {
        id: 2,
        amount: '',
        date: "",
        paymentStatus: ""
      },
    ]
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    fetchCustomerDetails(customerId);
  }, [customerId]);

  const handleStatusToggle = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      basicDetails: {
        ...prevDetails.basicDetails,
        status: !prevDetails.basicDetails.status,
      },
    }));
    setHasChanges(true);
  };

  const handlePaymentStatusToggle = (id: number, newStatus: string) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      payments: prevDetails.payments.map((payment) =>
        payment.id === id ? { ...payment, paymentStatus: newStatus } : payment
      ),
    }));
    setHasChanges(true);
  };

  const fetchCustomerDetails = async (id: number) => {
    showLoader();
    try {
      const response = await fakeApiCall(id);
      if (response.success) {
        setDetails(
          {
            basicDetails: {
              name: "Simran",
              email: "simranchawla@gmail.com",
              phone: "9877361313",
              amount: '300000',
              status: true
            },
            payments: [
              {
                id: 1,
                amount: "50000",
                date: "05-12-2001",
                paymentStatus: "pending"
              },
              {
                id: 2,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 3,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 4,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 5,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 6,
                amount: "20000",
                date: "20-01-2024",
                paymentStatus: "delayed"
              },
              {
                id: 7,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 8,
                amount: "20000",
                date: "20-01-2024",
                paymentStatus: "delayed"
              },
              {
                id: 9,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 10,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
              {
                id: 11,
                amount: "12000",
                date: "20-01-2002",
                paymentStatus: "paid"
              },
            ]
          }
        );
      } else {
        showToast('Failed to load customer details', 'error');
      }
    } catch (error) {
      showToast(`Error: ${error}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const fakeApiCall = (id: number) => {
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      setTimeout(() => {
        // if (email === 'test@example.com' && password === 'password') {
        resolve({ success: true });
        // } else {
        // resolve({ success: false, message: 'Invalid credentials' });
        // }
      }, 1000);
    });
  };

  if (!details) {
    return null;
  }

  return (
    <View style={styles.container}>
      {type === 'admin' && 
        <View style={styles.header}>
          <Icon name="arrow-left" size={20} color="#000" style={styles.backButton} onPress={handleBackFromDetails} />
          <Text style={styles.headerTitle}>Customer Details</Text>
          <TouchableOpacity style={[styles.saveButton, { opacity: hasChanges ? 1 : 0.5 }]} disabled={!hasChanges} onPress={() => { /* Save logic here **/ setHasChanges(false); }}>
            <Text> Save </Text>
          </TouchableOpacity>
        </View>
      }
      <View style={styles.card}>
        <View style={styles.leftContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{details?.basicDetails?.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{details?.basicDetails?.email}</Text>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{details?.basicDetails?.phone}</Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{details?.basicDetails?.amount}</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Active:</Text>
            <Switch value={details?.basicDetails?.status} onValueChange={handleStatusToggle} disabled={!(type === 'admin')} />
          </View>
        </View>
      </View>
      <ScrollView>
        {details.payments.map((payment, index) => (
          <View key={index} style={styles.paymentCard}>
            <View style={styles.paymentleftContainer}>
              <Text style={styles.paymentlabel}>Amount:</Text>
              <Text style={styles.paymentvalue}>{payment?.amount}</Text>
            </View>
            <View style={styles.paymentrightContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Due Date:</Text>
                <Text style={styles.dateValue}>{payment?.date}</Text>
              </View>
              <View style={styles.statusContainer}>
                <View style={[styles.statusTag, payment.paymentStatus === 'paid' ? styles.paid : payment.paymentStatus === 'delayed' ? styles.delayed : styles.pending]}>
                  <Icon name={payment?.paymentStatus === 'paid' ? 'check-circle' : payment?.paymentStatus === 'delayed' ? 'times-circle' : 'clock-o'} size={14} color={payment?.paymentStatus === 'paid' ? '#008000' : payment?.paymentStatus === 'delayed' ? '#ff0000' : 'gb(131 131 43)'} />
                  <Text style={styles.statusText}>{payment?.paymentStatus}</Text>
                </View>
                {type === 'admin' && <Menu>
                  <MenuTrigger>
                    <Icon name="edit" size={20} color="#000" />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'paid')} text="Paid" />
                    <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'delayed')} text="Delayed" />
                    <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'pending')} text="Pending" />
                  </MenuOptions>
                </Menu>}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

