import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { customerDetailStyles as styles } from '@/assets/styles/css';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SomethingWentWrong from '@/components/SomethingWentWrong';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';

export default function CustomerDetails() {
  const router = useRouter(); // Using router for navigation
  const { customerId, type } = useLocalSearchParams(); // Retrieving customerId and type (e.g., 'admin' or 'user') from the route parameters

  const { showLoader, hideLoader } = useLoader(); // Show/Hide loader during data fetch
  const showToast = useToast(); // Display toast messages for feedback

  // State to store customer details, including basic information and payment history
  const [details, setDetails] = useState({
    basicDetails: { name: "", email: "", phone: "", amount: "", status: true },
    payments: [
      { id: 0, amount: '', date: "", paymentStatus: "" },
      { id: 1, amount: '', date: "", paymentStatus: "" },
      { id: 2, amount: '', date: "", paymentStatus: "" },
    ]
  });

  const [hasChanges, setHasChanges] = useState(false); // Track if there are unsaved changes
  const [error, setError] = useState(false);  // Error state

  // Fetch customer details when the component mounts or customerId changes
  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails(Number(customerId)); // Fetch details for the specific customer
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
    showLoader(); // Show loader while fetching data
    setError(false);  // Reset error state

    try {
      const response = await fakeApiCall(id); // Simulate an API call
      if (response.success && id === 2) {
        // Set customer details based on the API response
        setDetails({
          basicDetails: {
            name: "Simran",
            email: "simranchawla@gmail.com",
            phone: "9877361313",
            amount: '300000',
            status: true,
          },
          payments: [
            { id: 1, amount: "50000", date: "05-12-2001", paymentStatus: "pending" },
            { id: 2, amount: "12000", date: "20-01-2002", paymentStatus: "paid" },
            { id: 3, amount: "12000", date: "20-01-2002", paymentStatus: "paid" },
            // Additional payment records...
          ]
        });
      } else {
        setError(true);  // Set error state if the API fails
        showToast('Failed to load customer details', 'error'); // Show error toast if the API call fails
      }
    } catch (error) {
      setError(true);  // Set error state if an exception occurs
      showToast(`Error: ${error}`, 'error'); // Show error toast if there was an exception
    } finally {
      hideLoader(); // Hide loader after fetching data
    }
  };

  // Mock API function to simulate fetching customer data
  const fakeApiCall = (id: number) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true }); // Simulate a successful API response
      }, 1000); // Simulate network delay
    });
  };

  if (error) {
    // Show "Something Went Wrong" page if there's an error
    return <SomethingWentWrong onRetry={() => fetchCustomerDetails(Number(2))} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        leftNode={
          <Image
            source={require("../assets/images/back-arrow-100.png")}
            style={{ width: 20, height: 20 }}
            resizeMode="contain"
          />
        }
        headerText="Customer Details"
        rightNode={
          <Image
            style={styles.profilePhoto}
            source={{
              uri: 'https://images.unsplash.com/photo-1528763380143-65b3ac89a3ff?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
            }}
          />
        }
        handleOnPressLeftNode={() => router.back()}
        handleOnPressRightNode={() => alert("This is a custom action!")}
      />

      {/* Basic customer details (name, email, phone, amount) */}
      <View style={styles.card}>
        <View style={styles.leftContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{details.basicDetails.name}</Text>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{details.basicDetails.email}</Text>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{details.basicDetails.phone}</Text>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.amountContainer}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{details.basicDetails.amount}</Text>
          </View>
          <View style={styles.switchContainer}>
            <Text style={styles.label}>Active:</Text>
            {/* Toggle switch to activate/deactivate customer status (only for admins) */}
            <Switch
              value={details.basicDetails.status}
              onValueChange={handleStatusToggle}
              disabled={type !== 'admin'} // Disable for non-admin users
            />
          </View>
        </View>
      </View>

      {/* Payment history list */}
      <ScrollView>
        {details.payments.map((payment, index) => (
          <View key={index} style={styles.paymentCard}>
            <View style={styles.paymentleftContainer}>
              <Text style={styles.paymentlabel}>Amount:</Text>
              <Text style={styles.paymentvalue}>{payment.amount}</Text>
            </View>
            <View style={styles.paymentrightContainer}>
              <View style={styles.dateContainer}>
                <Text style={styles.dateLabel}>Due Date:</Text>
                <Text style={styles.dateValue}>{payment.date}</Text>
              </View>
              <View style={styles.statusContainer}>
                {/* Display the payment status with icons (paid, delayed, pending) */}
                <View
                  style={[
                    styles.statusTag,
                    payment.paymentStatus === 'paid' ? styles.paid
                      : payment.paymentStatus === 'delayed' ? styles.delayed
                        : styles.pending
                  ]}>
                  <Icon
                    name={payment.paymentStatus === 'paid' ? 'check-circle'
                      : payment.paymentStatus === 'delayed' ? 'times-circle'
                        : 'clock-o'}
                    size={14}
                    color={payment.paymentStatus === 'paid' ? '#008000'
                      : payment.paymentStatus === 'delayed' ? '#ff0000'
                        : 'rgb(131, 131, 43)'}
                  />
                  <Text style={styles.statusText}>{payment.paymentStatus}</Text>
                </View>

                {/* Admin-only options to change payment status */}
                {type === 'admin' && (
                  <Menu>
                    <MenuTrigger>
                      <Icon name="edit" size={20} color="#000" />
                    </MenuTrigger>
                    <MenuOptions>
                      <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'paid')} text="Paid" />
                      <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'delayed')} text="Delayed" />
                      <MenuOption onSelect={() => handlePaymentStatusToggle(payment.id, 'pending')} text="Pending" />
                    </MenuOptions>
                  </Menu>
                )}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView >
  );

}
