import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { headerStyles as styles } from '@/assets/styles/css';
import CustomModal from '@/components/Modal';

interface HeaderProps {
  onSearch: (text: string) => void;
  addCustomer: (customerData: any) => Promise<void>;
  handleFilterChange: (status: string, sortOrder: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, addCustomer, handleFilterChange }) => {
  const [localSearchText, setLocalSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [currentSortOrder, setCurrentSortOrder] = useState('desc');

  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    tenure: '',
    roi: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    tenure: '',
    roi: '',
  });


  // Regex patterns
  const regexPatterns = {
    name: /^[a-zA-Z\s]+$/, // Only letters and spaces
    phone: /^[0-9]{10}$/, // 10 digits
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Valid email
    amount: /^[0-9]*\.?[0-9]+$/, // Positive number
    tenure: /^[0-9]+$/, // Positive integer
    roi: /^([0-9]{1,2})(\.[0-9]{1,2})?$/, // Percentage (e.g., 5, 7.5)
  };

  const handleSearchChange = (text: string) => {
    setLocalSearchText(text);
    onSearch(text);
  };

  const handleFilterSelect = (selectedFilter: string) => {
    setCurrentFilter(selectedFilter);
    handleFilterChange(selectedFilter, currentSortOrder);
  };

  const handleSortOrderSelect = (selectedSortOrder: string) => {
    setCurrentSortOrder(selectedSortOrder);
    handleFilterChange(currentFilter, selectedSortOrder);
  };

  // Validate input based on the field and value
  const validateInput = (field: string, value: string) => {
    const regex = regexPatterns[field as keyof typeof regexPatterns];
    if (regex && !regex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: `Invalid ${field}`,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: '',
      }));
    }
  };

  // Handle input changes for the customer form
  const handleInputChange = (field: string, value: string) => {
    setCustomerData({ ...customerData, [field]: value });
    validateInput(field, value);
  };

  // Handle the form submission for adding a customer
  const handleAddCustomer = async () => {
    if (isFormValid()) {
      await addCustomer(customerData);
      resetCustomerForm();
    } else {
      Alert.alert('Validation Error', 'Please correct the errors before submitting.');
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
          { text: 'Discard', style: 'destructive', onPress: resetCustomerForm },
        ],
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
    return Object.values(customerData).some((value) => value !== '');
  };

  // Form validation: Check if all required fields are filled and valid
  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => error === '') &&
        customerData.name &&
        customerData.phone &&
        customerData.email &&
        customerData.amount &&
        customerData.tenure &&
        customerData.roi &&
        customerData.address
        ? true : false
    );
  };


  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.filterSortContainer}>
          <Menu>
            <MenuTrigger>
              <View style={styles.filterContainer}>
                <FontAwesome name="filter" size={18} color="#555" />
                <Text style={styles.filterText}>Filter: {currentFilter}</Text>
                <FontAwesome name="chevron-down" size={18} color="#555" />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleFilterSelect('all')}>
                <Text style={styles.menuOptionText}>All</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleFilterSelect('active')}>
                <Text style={styles.menuOptionText}>Active</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleFilterSelect('inactive')}>
                <Text style={styles.menuOptionText}>Inactive</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>

          <Menu>
            <MenuTrigger>
              <View style={styles.filterContainer}>
                <FontAwesome name="sort" size={18} color="#555" />
                <Text style={styles.filterText}>Sort: {currentSortOrder === 'desc' ? 'Latest' : 'Oldest'}</Text>
                <FontAwesome name="chevron-down" size={18} color="#555" />
              </View>
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => handleSortOrderSelect('desc')}>
                <Text style={styles.menuOptionText}>Latest First</Text>
              </MenuOption>
              <MenuOption onSelect={() => handleSortOrderSelect('asc')}>
                <Text style={styles.menuOptionText}>Oldest First</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>

        <View style={styles.searchAddContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="#555" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={localSearchText}
              onChangeText={handleSearchChange}
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        onSubmit={handleAddCustomer}
        isFormValid={isFormValid()}
        submitButtonText="Add Customer"
        title="Add New Customer"
      >
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <FontAwesome name="user" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.name ? styles.inputError : null]}
              placeholder="Full Name"
              value={customerData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <View style={styles.inputGroup}>
            <FontAwesome name="phone" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.phone ? styles.inputError : null]}
              placeholder="Phone Number"
              value={customerData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

          <View style={styles.inputGroup}>
            <FontAwesome name="envelope" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.email ? styles.inputError : null]}
              placeholder="Email Address"
              value={customerData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              keyboardType="email-address"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="dollar" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.amount ? styles.inputError : null]}
                placeholder="Amount"
                value={customerData.amount}
                onChangeText={(text) => handleInputChange('amount', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="calendar" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.tenure ? styles.inputError : null]}
                placeholder="Tenure (months)"
                value={customerData.tenure}
                onChangeText={(text) => handleInputChange('tenure', text)}
                keyboardType="numeric"
              />
            </View>
          </View>
          {(errors.amount || errors.tenure) && (
            <Text style={styles.errorText}>{errors.amount || errors.tenure}</Text>
          )}

          <View style={styles.inputGroup}>
            <FontAwesome name="percent" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, errors.roi ? styles.inputError : null]}
              placeholder="ROI (%)"
              value={customerData.roi}
              onChangeText={(text) => handleInputChange('roi', text)}
              keyboardType="numeric"
            />
          </View>
          {errors.roi && <Text style={styles.errorText}>{errors.roi}</Text>}

          <View style={styles.inputGroup}>
            <FontAwesome name="map-marker" size={20} color="#555" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Address"
              value={customerData.address}
              onChangeText={(text) => handleInputChange('address', text)}
              multiline
            />
          </View>
        </View>
      </CustomModal>
    </View>
  );
};


export default Header;