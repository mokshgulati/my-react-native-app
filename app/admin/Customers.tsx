import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons'; // Add this import

import Header from '@/components/Header';
import PageHeader from '@/components/PageHeader';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'expo-router';
import { customersStyles as styles } from '@/assets/styles/css';

interface Customer {
  id: number;
  name: string;
  phone: string;
  amount: string;
  isActive: boolean;
  loanDate: string; // Add this new field
}

const initialCustomers: Customer[] = [
  { id: 1, name: 'John Doe', phone: '123-456-7890', amount: '100', isActive: true, loanDate: '2023-05-15' },
  { id: 3, name: 'Jane Smith', phone: '098-765-4321', amount: '1500', isActive: false, loanDate: '2023-06-20' },
  { id: 4, name: 'Emily Davis', phone: '234-567-8901', amount: '200', isActive: true, loanDate: '2023-07-01' },
  { id: 5, name: 'Michael Brown', phone: '345-678-9012', amount: '250000', isActive: false, loanDate: '2023-07-10' },
  { id: 6, name: 'Sarah Wilson', phone: '456-789-0123', amount: '300', isActive: true, loanDate: '2023-07-15' },
  { id: 1, name: 'John Doe', phone: '123-456-7890', amount: '100', isActive: true, loanDate: '2023-05-15' },
  { id: 3, name: 'Jane Smith', phone: '098-765-4321', amount: '1500', isActive: false, loanDate: '2023-06-20' },
  { id: 4, name: 'Emily Davis', phone: '234-567-8901', amount: '200', isActive: true, loanDate: '2023-07-01' },
  { id: 5, name: 'Michael Brown', phone: '345-678-9012', amount: '250000', isActive: false, loanDate: '2023-07-10' },
  { id: 6, name: 'Sarah Wilson', phone: '456-789-0123', amount: '300', isActive: true, loanDate: '2023-07-15' },
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [searchText, setSearchText] = useState<string>('');
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    showLoader();
    try {
      const response = await fakeApiCall();
      if (response.success) {
        // Assume we get new customers from the API
        // setCustomers(response.data); Uncomment this when real API is used
      } else {
        showToast('Failed to fetch customers', 'error');
      }
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const fakeApiCall = () => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleRowClick = (customerId: number) => {
    router.push(`/CustomerDetail?customerId=${customerId}`);
  };

  const toggleCustomerStatus = (customerId: number) => {
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.id === customerId
          ? { ...customer, isActive: !customer.isActive }
          : customer
      )
    );
  };

  const addCustomer = async (newCustomer: Customer) => {
    showLoader();
    try {
      const response = await fakeApiCall();
      if (response.success) {
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
      } else {
        showToast('Failed to add customer', 'error');
      }
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const filterCustomers = useCallback(() => {
    return customers.filter((customer) =>
      [customer.name, customer.phone, customer.amount]
        .some(field => field.toLowerCase().includes(searchText.toLowerCase()))
    );
  }, [customers, searchText]);

  const handleFilterChange = (status: string) => {
    // Placeholder for filtering logic (active/inactive)
  };

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '₹0';
    
    const [wholePart, decimalPart] = num.toFixed(2).split('.');
    const lastThree = wholePart.substring(wholePart.length - 3);
    const otherNumbers = wholePart.substring(0, wholePart.length - 3);
    const formattedWholePart = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + 
      (otherNumbers ? ',' : '') + lastThree;
    
    return decimalPart === '00' 
      ? `₹${formattedWholePart}` 
      : `₹${formattedWholePart}.${decimalPart}`;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageHeader
          leftNode={
            <Image
              source={require('@/assets/images/back-arrow-100.png')}
              style={{ width: 20, height: 20 }}
              resizeMode="contain"
            />
          }
          headerText="Debtors"
          rightNode={
            <Image
              style={styles.profilePhoto}
              source={require('@/assets/images/avatarIconBlue.png')}
              resizeMode="contain"
            />
          }
          handleOnPressLeftNode={router.back}
          handleOnPressRightNode={() => Alert.alert('Custom Action')}
        />
        <Header onSearch={setSearchText} addCustomer={addCustomer} handleFilterChange={handleFilterChange} />
        <ScrollView>
          {filterCustomers().map((customer, index) => (
            <TouchableOpacity key={index} onPress={() => handleRowClick(customer.id)}>
              <View style={[styles.rowWrapper, index === 0 && { marginTop: 15 }]}>
                <View style={[styles.rowContainer, { backgroundColor: '#E8E8E8' }]}>
                  <View style={styles.leftColumn}>
                    <View style={styles.nameContainer}>
                      <Ionicons name="person" size={16} color="gray" />
                      <Text style={styles.nameText}>{customer.name}</Text>
                    </View>
                    <View style={styles.phoneContainer}>
                      <Ionicons name="call" size={16} color="gray" />
                      <Text style={styles.phoneText}>+91 {customer.phone}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                      <Ionicons name="calendar" size={16} color="gray" />
                      <Text style={styles.dateText}>Date-borrowed: {customer.loanDate}</Text>
                    </View>
                  </View>
                  <View style={styles.rightColumn}>
                    <View>
                      <Text style={styles.amountLabel}>Amount:</Text>
                      <Text style={styles.amountText}>{formatAmount(customer.amount)}</Text>
                    </View>
                    <FontAwesome
                      style={styles.activeStatus}
                      name="dot-circle-o"
                      size={20}
                      color={customer.isActive ? '#399918' : '#C7253E'}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Customers;