import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { headerStyles as styles } from '@/assets/styles/css';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '@/components/Modal';

interface HeaderProps {
  onSearch: (text: string) => void;
  addCustomer: (customerData: any) => Promise<void>;
  handleFilterChange: (status: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, addCustomer, handleFilterChange }) => {
  const [localSearchText, setLocalSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    tenure: '',
    roi: '',
    address: '',
  });

  // Handle text changes in the search bar
  const handleSearchChange = (text: string) => {
    setLocalSearchText(text);
    onSearch(text);
  };

  // Handle input changes for the customer form
  const handleInputChange = (field: string, value: string) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  // Handle the form submission for adding a customer
  const handleAddCustomer = async () => {
    if (isFormValid()) {
      await addCustomer(customerData);
      closeModal();
    } else {
      Alert.alert('Validation Error', 'Please fill in all fields before submitting.');
    }
  };

  // Close modal and reset form fields
  const closeModal = () => {
    setModalVisible(false);
    resetCustomerForm();
  };

  // Reset the customer form fields
  const resetCustomerForm = () => {
    setCustomerData({
      name: '',
      phone: '',
      email: '',
      amount: '',
      tenure: '',
      roi: '',
      address: '',
    });
  };

  // Form validation: Check if all required fields are filled
  const isFormValid = () => {
    return customerData.name && customerData.phone && customerData.email && customerData.amount && customerData.tenure && customerData.roi && customerData.address;
  };

  const handleFilterSelect = (selectedFilter: string) => {
    handleFilterChange(selectedFilter);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>

        {/* Custom Modal for Adding Customers */}
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSubmit={handleAddCustomer}
          isFormValid={isFormValid() ? true : false}
          submitButtonText="Add Customer"
        >
          <TextInput style={styles.input} placeholder="Name" value={customerData.name} onChangeText={(text) => handleInputChange('name', text)} />
          <TextInput style={styles.input} placeholder="Phone" value={customerData.phone} onChangeText={(text) => handleInputChange('phone', text)} />
          <TextInput style={styles.input} placeholder="Email" value={customerData.email} onChangeText={(text) => handleInputChange('email', text)} />
          <TextInput style={styles.input} placeholder="Amount" value={customerData.amount} onChangeText={(text) => handleInputChange('amount', text)} />
          <TextInput style={styles.input} placeholder="Tenure" value={customerData.tenure} onChangeText={(text) => handleInputChange('tenure', text)} />
          <TextInput style={styles.input} placeholder="ROI" value={customerData.roi} onChangeText={(text) => handleInputChange('roi', text)} />
          <TextInput style={styles.input} placeholder="Address" value={customerData.address} onChangeText={(text) => handleInputChange('address', text)} />
        </CustomModal>

        <Text style={styles.textHeading}>All Customers</Text>
        <View style={styles.headerContainer}>
          <Menu>
            <MenuTrigger>
              <View style={styles.filterContainer}>
                <FontAwesome name="filter" size={18} color="rgb(182, 180, 180)" />
                <Text style={styles.filterText}>Filter</Text>
                <FontAwesome name="chevron-down" size={18} color="rgb(182, 180, 180)" />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleFilterSelect('active')}>
                <Text style={styles.menuOptionText}>Active</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleFilterSelect('inactive')}>
                <Text style={styles.menuOptionText}>Inactive</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>

          {/* Search Input */}
          <View style={styles.inputContainer}>
            <View style={styles.searchContainer}>
              <FontAwesome name="search" size={18} color="rgb(182, 180, 180)" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search here..."
                placeholderTextColor="rgb(182, 180, 180)"
                value={localSearchText}
                onChangeText={handleSearchChange}
                underlineColorAndroid="transparent"
                selectionColor="rgb(100,120,189)"
              />
            </View>

            {/* Add Customer Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

export default Header;
