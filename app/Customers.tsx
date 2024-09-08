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
import { getAllUsers, User, addCustomerToDatabase } from '@/lib/appwrite';

const Customers = () => {
  const [customers, setCustomers] = useState<User[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<User[]>([]);
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
      const fetchedCustomers = await getAllUsers();
      console.log("fetchCustomers", fetchedCustomers);
      setCustomers(fetchedCustomers);
    } catch (error: any) {
      showToast(`Failed to fetch customers. Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const handleRowClick = (customerId: string) => {
    router.push(`/CustomerDetail?customerId=${customerId}`);
  };

  const addCustomer = async (newCustomerData: Partial<User>) => {
    showLoader();
    try {
      const newCustomer = await addCustomerToDatabase(newCustomerData);
      console.log("newCustomer", newCustomer);
      setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
      showToast('Customer added successfully', 'success');
    } catch (error: any) {
      showToast(`Failed to add customer. Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const filterAndSortCustomers = useCallback(() => {
    let result = customers;

    if (searchText) {
      result = result.filter((customer) =>
        [customer.username, customer.email, customer.phone, customer.borrowedAmount?.toString()]
          .some(field => field && field.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    result = result.filter((customer) =>
      currentFilter === 'all' ? true : currentFilter === 'active' ? customer.loanStatus === 'active' : customer.loanStatus === 'inactive'
    );

    result.sort((a, b) => {
      const dateA = new Date(a.borrowedOn || '').getTime();
      const dateB = new Date(b.borrowedOn || '').getTime();
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
        <TouchableOpacity key={index} onPress={() => handleRowClick(customer.$id)}>
          <View style={styles.rowWrapper}>
            <View style={styles.rowContainer}>
              <View style={styles.leftColumn}>
                <View style={styles.nameContainer}>
                  <Ionicons name="person" size={16} color="gray" />
                  <Text style={styles.nameText}>{customer.username}</Text>
                </View>
                <View style={styles.phoneContainer}>
                  <Ionicons name="call" size={16} color="gray" />
                  <Text style={styles.phoneText}>+91 {customer.phone}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Ionicons name="calendar" size={16} color="gray" />
                  <Text style={styles.dateText}>Date-borrowed: {customer.borrowedOn ? new Date(customer.borrowedOn).toLocaleDateString() : 'N/A'}</Text>
                </View>
              </View>
              <View style={styles.rightColumn}>
                <View>
                  <Text style={styles.amountLabel}>Amount:</Text>
                  <Text style={styles.amountText}>{formatAmount(customer.borrowedAmount?.toString() || '0')}</Text>
                </View>
                <FontAwesome
                  style={styles.activeStatus}
                  name="dot-circle-o"
                  size={20}
                  color={customer?.loanStatus === 'active' ? '#399918' : '#C7253E'}
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