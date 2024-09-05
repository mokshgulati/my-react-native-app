import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import Header from '@/components/Header'; // Importing the Header component for search and filter
import { useLoader } from '@/providers/LoaderProvider'; // Importing loader provider for showing/hiding loader
import { useToast } from '@/providers/ToastProvider'; // Importing toast provider for showing toast messages
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Importing icons from FontAwesome
import { customersStyles as styles } from '@/assets/styles/css'; // Importing styles from CSS
import { useRouter } from 'expo-router'; // Using router for navigation
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';

export default function Customers() {
  const [customers, setCustomers] = useState([
    // Mocked customer data
    { id: 1, name: 'John Doe', phone: '123-456-7890', amount: '$100', isActive: true },
    { id: 3, name: 'Jane Smith', phone: '098-765-4321', amount: '$150', isActive: false },
    { id: 4, name: 'Emily Davis', phone: '234-567-8901', amount: '$200', isActive: true },
    { id: 5, name: 'Michael Brown', phone: '345-678-9012', amount: '$250', isActive: false },
    { id: 6, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 7, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    { id: 8, name: 'Sarah Wilson', phone: '456-789-0123', amount: '$300', isActive: true },
    // Additional customers...
  ]);

  const [searchText, setSearchText] = useState(''); // Search text state
  const { showLoader, hideLoader } = useLoader(); // Show/hide loader
  const showToast = useToast(); // Display toast messages
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    // Load customer data when the component mounts
    getCustomers(customers);
  }, []);

  // Handle row click to navigate to the customer details screen
  const handleRowClick = (customerId: number) => {
    router.push(`/CustomerDetail?customerId=1`); // Navigate to the CustomerDetail screen
  };

  // Mock function to simulate an API call to get customers
  const getCustomers = async (customerData: any) => {
    showLoader(); // Show loader while fetching customers
    try {
      const response = await fakeApiCall(customerData); // Simulate API call
      if (response.success) {
        // setCustomers(customerData); // Uncomment if fetching actual data from an API
      } else {
        showToast('Failed to get customers', 'error'); // Show error toast if the API call fails
      }
    } catch (error) {
      showToast(`Error fetching customers: ${error}`, "error"); // Show error toast if an exception occurs
    } finally {
      hideLoader(); // Hide the loader after the API call
    }
  };

  // Add a new customer and refresh the customer list
  const addCustomer = async (customerData: any) => {
    showLoader(); // Show loader while adding customer
    try {
      const response = await fakeApiCall(customerData); // Simulate API call
      if (response.success) {
        getCustomers(customerData); // Reload the customer list after adding a customer
      } else {
        hideLoader();
        showToast('Failed to add customer', 'error'); // Show error toast if adding the customer fails
      }
    } catch (error) {
      hideLoader();
      showToast(`Error adding customer: ${error}`, "error"); // Show error toast if an exception occurs
    }
  };

  // Simulated API call function
  const fakeApiCall = (customerData: any) => {
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true }); // Mock successful response
      }, 1000); // Simulate network delay
    });
  };

  // Toggle the active/inactive status of a customer
  const toggleSwitch = (index: number) => {
    setCustomers((prevCustomers) => {
      const updatedCustomers = [...prevCustomers]; // Copy the customer array
      updatedCustomers[index].isActive = !updatedCustomers[index].isActive; // Toggle active status
      return updatedCustomers; // Return the updated array
    });
  };

  // Filter customers based on the search text
  const filteredCustomers = customers.filter((customer) => {
    const searchLower = searchText.toLowerCase(); // Convert search text to lowercase
    return (
      customer.name.toLowerCase().includes(searchLower) || // Match name
      customer.phone.includes(searchLower) || // Match phone
      customer.amount.includes(searchLower) // Match amount
    );
  });

  // Handle filter change for customers (e.g., active/inactive)
  const handleFilterChange = (status: string) => {
    // Placeholder for handling customer filter (active/inactive)
    // This function will be implemented as needed
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <PageHeader
        leftNode={
          <Image
            source={require("@/assets/images/back-arrow-100.png")}
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
        {/* Header component with search and filter functionality */}
        <Header onSearch={setSearchText} addCustomer={addCustomer} handleFilterChange={handleFilterChange} />

        {/* Scrollable list of filtered customers */}
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
    </SafeAreaView >
  );
}
