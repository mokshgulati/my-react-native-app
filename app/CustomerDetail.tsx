import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SomethingWentWrong from '@/components/SomethingWentWrong';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';
import { customerDetailStyles as styles } from '@/assets/styles/css';
import TransactionModal from '@/components/TransactionModal';

export interface CustomerDetails {
  basicDetails: {
    name: string;
    email: string;
    phone: string;
    amount: string;
    status: boolean;
  };
  payments: Payment[];
}

export interface Payment {
  id: number;
  amount: string;
  date: string;
  paymentStatus: string;
}

export default function CustomerDetailsScreen() {
  const router = useRouter();
  const { customerId, type } = useLocalSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();

  const [details, setDetails] = useState<CustomerDetails>({
    basicDetails: { name: "", email: "", phone: "", amount: "", status: true },
    payments: []
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(Number(customerId));
    }
  }, [customerId]);

  // Toggle the customer's active status (only for admins)
  const handleStatusToggle = () => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      basicDetails: {
        ...prevDetails.basicDetails,
        status: !prevDetails.basicDetails.status, // Toggle active/inactive status
      },
    }));
    setHasChanges(true); // Mark changes as unsaved
  };

  // Toggle the status of a specific payment (only for admins)
  const handlePaymentStatusToggle = (id: number, newStatus: string) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      payments: prevDetails.payments.map(payment =>
        payment.id === id ? { ...payment, paymentStatus: newStatus } : payment // Update the payment status
      ),
    }));
    setHasChanges(true); // Mark changes as unsaved
  };

  // Fetch customer details from the server (mocked with fakeApiCall)
  const fetchCustomerDetails = async (id: number) => {
    showLoader();
    setError(false);

    try {
      const response = await fakeApiCall(id);
      if (response.success) {
        setDetails(response.data);
      } else {
        throw new Error('Failed to load customer details');
      }
    } catch (error: any) {
      setError(true);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const fakeApiCall = (id: number): Promise<{ success: boolean, data: CustomerDetails }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            basicDetails: {
              name: "Simran Chawla",
              email: "simran.chawla@example.com",
              phone: "+91 98773 61313",
              amount: '300000',
              status: true,
            },
            payments: [
              { id: 1, amount: "50000", date: "2023-12-05", paymentStatus: "pending" },
              { id: 2, amount: "12000", date: "2024-01-20", paymentStatus: "paid" },
              { id: 3, amount: "12000", date: "2024-02-15", paymentStatus: "paid" },
            ]
          }
        });
      }, 1000);
    });
  };

  const handleAddTransaction = (transactionData: any) => {
    setDetails((prevDetails) => ({
      ...prevDetails,
      payments: [...prevDetails.payments, { id: Date.now(), ...transactionData }],
    }));
    setIsTransactionModalVisible(false);
    setHasChanges(true);
  };

  if (error) {
    return <SomethingWentWrong onRetry={() => fetchCustomerDetails(Number(customerId))} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        leftNode={
          <Image
            source={require('@/assets/images/back-arrow-100.png')}
            style={styles.headerIcon}
            resizeMode="contain"
          />
        }
        headerText="Customer Details"
        rightNode={
          <Image
            style={styles.profilePhoto}
            source={require('@/assets/images/avatarIconBlue.png')}
            resizeMode="contain"
          />
        }
        handleOnPressLeftNode={() => router.back()}
        handleOnPressRightNode={() => alert("Profile action")}
      />

      <View style={styles.addTransactionContainer}>
        <TouchableOpacity
          style={styles.addTransactionButton}
          onPress={() => setIsTransactionModalVisible(true)}
        >
          <Text style={styles.addTransactionButtonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>

      <TransactionModal
        visible={isTransactionModalVisible}
        onClose={() => setIsTransactionModalVisible(false)}
        onSubmit={handleAddTransaction}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.avatarContainer}>
            <Icon name="account" size={60} color="#4A90E2" />
          </View>
          <View style={styles.detailsContainer}>
            <DetailItem icon="account" label="Name" value={details.basicDetails.name} />
            <DetailItem icon="email" label="Email" value={details.basicDetails.email} />
            <DetailItem icon="phone" label="Phone" value={details.basicDetails.phone} />
            <DetailItem icon="currency-usd" label="Amount" value={`$${details.basicDetails.amount}`} />
            <View style={styles.statusContainer}>
              <Icon name={details.basicDetails.status ? "check-circle" : "close-circle"} size={24} color={details.basicDetails.status ? "#4CAF50" : "#F44336"} />
              <Text style={styles.statusText}>{details.basicDetails.status ? "Active" : "Inactive"}</Text>
              {type === 'admin' && (
                <Switch
                  value={details.basicDetails.status}
                  onValueChange={handleStatusToggle}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={details.basicDetails.status ? "#f5dd4b" : "#f4f3f4"}
                />
              )}
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment History</Text>
        {details.payments.map((payment, index) => (
          <PaymentCard key={index} payment={payment} isAdmin={type === 'admin'} onStatusChange={handlePaymentStatusToggle} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const DetailItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={styles.detailItem}>
    <Icon name={icon} size={20} color="#4A90E2" style={styles.detailIcon} />
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const PaymentCard = ({ payment, isAdmin, onStatusChange }: { payment: Payment, isAdmin: boolean, onStatusChange: (id: number, newStatus: string) => void }) => (
  <View style={styles.paymentCard}>
    <View style={styles.paymentDetails}>
      <Text style={styles.paymentAmount}>${payment.amount}</Text>
      <Text style={styles.paymentDate}>{new Date(payment.date).toLocaleDateString()}</Text>
    </View>
    <View style={styles.paymentStatus}>
      <StatusTag status={payment.paymentStatus} />
      {isAdmin && (
        <Menu>
          <MenuTrigger>
            <Icon name="dots-vertical" size={20} color="#000" />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption onSelect={() => onStatusChange(payment.id, 'paid')} text="Mark as Paid" />
            <MenuOption onSelect={() => onStatusChange(payment.id, 'pending')} text="Mark as Pending" />
            <MenuOption onSelect={() => onStatusChange(payment.id, 'delayed')} text="Mark as Delayed" />
          </MenuOptions>
        </Menu>
      )}
    </View>
  </View>
);

const StatusTag = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'pending': return '#FFC107';
      case 'delayed': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  return (
    <View style={[styles.statusTag, { backgroundColor: getStatusColor() }]}>
      <Text style={styles.statusTagText}>{status.toUpperCase()}</Text>
    </View>
  );
};