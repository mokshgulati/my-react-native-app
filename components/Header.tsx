import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
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
    setCustomerData({ ...customerData, [field]: value.trim() });
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
    if (isFormDirty()) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: resetCustomerForm }
        ]
      );
    } else {
      setModalVisible(false);
    }
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
    setModalVisible(false);
  };

  // Check if the form is dirty
  const isFormDirty = () => {
    return Object.values(customerData).some(value => value !== '');
  };

  // Form validation: Check if all required fields are filled
  const isFormValid = () => {
    return customerData.name && customerData.phone && customerData.email && customerData.amount && customerData.tenure && customerData.roi && customerData.address ? true : false;
  };

  const handleFilterSelect = (selectedFilter: string) => {
    handleFilterChange(selectedFilter);
  };

  return (
    <SafeAreaView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View>

          {/* Custom Modal for Adding Customers */}
          <CustomModal
            visible={modalVisible}
            onClose={closeModal}
            onSubmit={handleAddCustomer}
            isFormValid={isFormValid()}
            submitButtonText="Add Customer"
          >
            <View style={styles.formContainer}>
              {/* Full-width Inputs */}
              <TextInput
                style={styles.fullWidthInput}
                placeholder="Name"
                value={customerData.name}
                onChangeText={(text) => handleInputChange('name', text)}
              />
              <TextInput
                style={styles.fullWidthInput}
                placeholder="Phone"
                value={customerData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
              />
              <TextInput
                style={styles.fullWidthInput}
                placeholder="Email"
                value={customerData.email}
                onChangeText={(text) => handleInputChange('email', text)}
              />

              {/* Row Layout for Related Fields */}
              <View style={styles.row}>
                <TextInput
                  style={[styles.halfWidthInput, styles.marginRight]}
                  placeholder="Amount"
                  value={customerData.amount}
                  onChangeText={(text) => handleInputChange('amount', text)}
                />
                <TextInput
                  style={[styles.quarterWidthInput, styles.marginRight]}
                  placeholder="Tenure"
                  value={customerData.tenure}
                  onChangeText={(text) => handleInputChange('tenure', text)}
                />
                <TextInput
                  style={styles.quarterWidthInput}
                  placeholder="ROI"
                  value={customerData.roi}
                  onChangeText={(text) => handleInputChange('roi', text)}
                />
              </View>

              <TextInput
                style={styles.fullWidthInput}
                placeholder="Address"
                value={customerData.address}
                onChangeText={(text) => handleInputChange('address', text)}
              />
            </View>
          </CustomModal>

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
                {/* <TextInput
                  style={[styles.quarterWidthInput, styles.marginRight]}
                  placeholder="Search"
                  placeholderTextColor="rgb(182, 180, 180)"
                  value={localSearchText}
                  onChangeText={(text) => handleSearchChange(text)}
                  // underlineColorAndroid="transparent"
                  // selectionColor="rgb(100,120,189)"
                /> */}
              </View>

              {/* Add Customer Button */}
              <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Header;
