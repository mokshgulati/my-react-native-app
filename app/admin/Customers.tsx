import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import Header from '../../components/Header';
import { useLoader } from '../providers/LoaderProvider';
import { useToast } from '../providers/ToastProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { customersStyles as styles } from '@/assets/styles/css';

interface CustomersProps {
  onCustomerSelect: (customerId: number) => void;
}

export default function Customers({ onCustomerSelect }: CustomersProps) {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Doe', phone: '123-456-7890', amount: '$100', isActive: true },
    { id: 3, name: 'Jane Smith', phone: '098-765-4321', amount: '$150', isActive: false },
    { id: 4, name: 'Emily Davis', phone: '234-567-8901', amount: '$200', isActive: true },
    { id: 5, name: 'Michael Brown', phone: '345-678-9012', amount: '$250', isActive: false },
    { id: 6, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 7, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 8, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 9, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 10, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 11, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 12, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 13, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
  ]);

  const [searchText, setSearchText] = useState('');
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();

  useEffect(() => {
    getCustomers(customers);
  }, []);

  const handleRowClick = (customerId: number) => {
    if (onCustomerSelect) {
      onCustomerSelect(customerId);
    }
  };

  const getCustomers = async (customerData: any) => {
    showLoader();
    try {
      const response = await fakeApiCall(customerData);
      if (response.success) {
        // setCustomers(customerData);
      } else {
        showToast('failed to get customers', 'error');
      }
    } catch (error) {
      showToast(`Error fetching customers: ${error}`, "error");
    } finally {
      hideLoader()
    }
  };

  const addCustomer = async (customerData: any) => {
    showLoader()
    try {
      const response = await fakeApiCall(customerData);
      if (response.success) {
        getCustomers(customerData);
      } else {
        hideLoader()
        showToast('failed to add customer', 'error');
      }
    } catch (error) {
      hideLoader()
      showToast(`Error adding customer: ${error}`, "error");
    }
  };

  const fakeApiCall = (customerData: any) => {
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

  const toggleSwitch = (index: number) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers];
      updatedCustomers[index].isActive = !updatedCustomers[index].isActive;
      return updatedCustomers;
    });
  };

  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchText.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.phone.includes(searchLower) ||
      customer.amount.includes(searchLower)
    );
  });

  const handleFilterChange = (status: string) => {
    //filter the customeres based on the status:) , {khud bhi kro kuch;)}
  }

  return (
    <View style={styles.container}>
      <Header onSearch={setSearchText} addCustomer={addCustomer} handleFilterChange={handleFilterChange} />
      <ScrollView>
        {filteredCustomers.map((customer, index) => (
          <TouchableOpacity key={index} onPress={() => handleRowClick(customer.id)}>
            <View style={styles.rowWrapper}>
              <View style={styles.rowContainer}>
                <View style={styles.leftColumn}>
                  <Text style={styles.nameText}>{customer.name}</Text>
                  <Text style={styles.phoneText}>{customer.phone}</Text>
                </View>
                <View style={styles.rightColumn}>
                  <View style={styles.statusContainer}>
                    <FontAwesome
                      name={customer.isActive ? "dot-circle-o" : "dot-circle-o"}
                      size={20}
                      color={customer.isActive ? "green" : "red"}
                    />
                    <Text style={styles.amountText}>{customer.amount}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}