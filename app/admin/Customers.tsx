import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';

import Header from '@/components/Header';
import PageHeader from '@/components/PageHeader';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { router } from 'expo-router';
import { customersStyles as styles } from '@/assets/styles/css';
import { useSession } from '@/providers/SessionProvider';

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
  { id: 2, name: 'Jane Smith', phone: '098-765-4321', amount: '1500', isActive: false, loanDate: '2023-06-20' },
  { id: 3, name: 'Emily Davis', phone: '234-567-8901', amount: '200', isActive: true, loanDate: '2023-07-01' },
  { id: 4, name: 'Michael Brown', phone: '345-678-9012', amount: '250000', isActive: false, loanDate: '2023-07-10' },
  { id: 5, name: 'Sarah Wilson', phone: '456-789-0123', amount: '300', isActive: true, loanDate: '2023-07-15' },
  { id: 6, name: 'David Lee', phone: '567-890-1234', amount: '450', isActive: true, loanDate: '2023-07-05' },
  { id: 7, name: 'Laura Turner', phone: '678-901-2345', amount: '600', isActive: false, loanDate: '2023-06-15' },
  { id: 8, name: 'Steve King', phone: '789-012-3456', amount: '1250', isActive: true, loanDate: '2023-05-25' },
  { id: 9, name: 'Linda Johnson', phone: '890-123-4567', amount: '750', isActive: false, loanDate: '2023-07-20' },
  { id: 10, name: 'Paul Green', phone: '901-234-5678', amount: '500', isActive: true, loanDate: '2023-04-10' },
  { id: 11, name: 'Nancy Clark', phone: '012-345-6789', amount: '800', isActive: true, loanDate: '2023-06-01' },
  { id: 12, name: 'James Harris', phone: '123-456-9876', amount: '1000', isActive: false, loanDate: '2023-07-12' },
  { id: 13, name: 'Karen Allen', phone: '234-567-0987', amount: '950', isActive: true, loanDate: '2023-05-05' },
  { id: 14, name: 'Peter Wright', phone: '345-678-1098', amount: '350', isActive: false, loanDate: '2023-06-25' },
  { id: 15, name: 'Susan Scott', phone: '456-789-2109', amount: '275', isActive: true, loanDate: '2023-07-07' },
  { id: 16, name: 'George Edwards', phone: '567-890-3210', amount: '125', isActive: true, loanDate: '2023-05-30' },
  { id: 17, name: 'Betty Mitchell', phone: '678-901-4321', amount: '550', isActive: false, loanDate: '2023-06-18' },
  { id: 18, name: 'Charles White', phone: '789-012-5432', amount: '700', isActive: true, loanDate: '2023-07-22' },
  { id: 19, name: 'Amy Young', phone: '890-123-6543', amount: '400', isActive: true, loanDate: '2023-07-18' },
  { id: 20, name: 'Gary Roberts', phone: '901-234-7654', amount: '800', isActive: false, loanDate: '2023-06-08' },
];


const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>(initialCustomers);
  const [searchText, setSearchText] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSortOrder, setCurrentSortOrder] = useState('desc');
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();
  const { handleLogout } = useSession();

  useEffect(() => {
    fetchCustomers(); 
  }, []);

  useEffect(() => {
    filterAndSortCustomers();
  }, [customers, searchText, currentFilter, currentSortOrder]);

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

  const addCustomer = async (newCustomer: Customer) => {
    showLoader();
    try {
      const response = await fakeApiCall();
      if (response.success) {
        setCustomers((prevCustomers) => [...prevCustomers, { ...newCustomer, id: Date.now(), isActive: true, loanDate: new Date().toISOString().split('T')[0] }]);
        showToast('Customer added successfully', 'success');
      } else {
        showToast('Failed to add customer', 'error');
      }
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const filterAndSortCustomers = useCallback(() => {
    let result = customers;

    // Apply search filter
    if (searchText) {
      result = result.filter((customer) =>
        [customer.name, customer.phone, customer.amount]
          .some(field => field.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    // Apply status filter
    if (currentFilter !== 'all') {
      result = result.filter((customer) =>
        currentFilter === 'active' ? customer.isActive : !customer.isActive
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const dateA = new Date(a.loanDate).getTime();
      const dateB = new Date(b.loanDate).getTime();
      return currentSortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredCustomers(result);
  }, [customers, searchText, currentFilter, currentSortOrder]);

  const handleFilterChange = (status: string, sortOrder: string) => {
    setCurrentFilter(status);
    setCurrentSortOrder(sortOrder);
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
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <PageHeader
        leftNode={
          <Image
            source={require('@/assets/images/back-arrow-100.png')}
            style={styles.headerIcon}
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
        handleOnPressRightNode={handleLogout}
      />
      <Header
        onSearch={setSearchText}
        addCustomer={addCustomer}
        handleFilterChange={handleFilterChange}
      />
      <ScrollView style={styles.scrollView}>
        {filteredCustomers.map((customer, index) => (
          <TouchableOpacity key={index} onPress={() => handleRowClick(customer.id)}>
            <View style={styles.rowWrapper}>
              <View style={styles.rowContainer}>
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
    </SafeAreaView>
  );
};

export default Customers;