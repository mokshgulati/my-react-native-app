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
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    borrowedAmount: '',
    borrowedOn: new Date().toISOString().split('T')[0],
    interestRate: '',
    loanTenureInMonths: '',
    totalAmountPaid: '0',
    loanStatus: 'active',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    email: '',
    borrowedAmount: '',
    interestRate: '',
    loanTenureInMonths: '',
  });


  // Regex patterns
  const regexPatterns = {
    fullName: /^[a-zA-Z\s]+$/,
    phone: /^[0-9]{10}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    borrowedAmount: /^[0-9]*\.?[0-9]+$/,
    interestRate: /^([0-9]{1,2})(\.[0-9]{1,2})?$/,
    loanTenureInMonths: /^[0-9]+$/,
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
      const newCustomer = {
        ...customerData,
        borrowedAmount: parseFloat(customerData.borrowedAmount),
        totalAmountPaid: parseFloat(customerData.totalAmountPaid),
        interestRate: parseFloat(customerData.interestRate),
        loanTenureInMonths: parseInt(customerData.loanTenureInMonths),
      };
      await addCustomer(newCustomer);
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
      fullName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      borrowedAmount: '',
      borrowedOn: new Date().toISOString().split('T')[0],
      interestRate: '',
      loanTenureInMonths: '',
      loanStatus: 'active',
      totalAmountPaid: '0',
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
        customerData.fullName &&
        customerData.phone &&
        customerData.email &&
        customerData.borrowedAmount &&
        customerData.interestRate &&
        customerData.loanTenureInMonths &&
        customerData.address &&
        customerData.city &&
        customerData.state
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
              <MenuOption onSelect={() => handleFilterSelect('closed')}>
                <Text style={styles.menuOptionText}>Closed</Text>
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
              style={[styles.input, errors.fullName ? styles.inputError : null]}
              placeholder="Full Name"
              value={customerData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

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

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="building" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={customerData.city}
                onChangeText={(text) => handleInputChange('city', text)}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="map" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="State"
                value={customerData.state}
                onChangeText={(text) => handleInputChange('state', text)}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="rupee" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.borrowedAmount ? styles.inputError : null]}
                placeholder="Borrowed Amount"
                value={customerData.borrowedAmount}
                onChangeText={(text) => handleInputChange('borrowedAmount', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="calendar" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Borrowed On"
                value={customerData.borrowedOn}
                onChangeText={(text) => handleInputChange('borrowedOn', text)}
              />
            </View>
          </View>
          {errors.borrowedAmount && <Text style={styles.errorText}>{errors.borrowedAmount}</Text>}

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="percent" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.interestRate ? styles.inputError : null]}
                placeholder="Interest Rate (%)"
                value={customerData.interestRate}
                onChangeText={(text) => handleInputChange('interestRate', text)}
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <FontAwesome name="clock-o" size={20} color="#555" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.loanTenureInMonths ? styles.inputError : null]}
                placeholder="Loan Tenure (months)"
                value={customerData.loanTenureInMonths}
                onChangeText={(text) => handleInputChange('loanTenureInMonths', text)}
                keyboardType="numeric"
              />
            </View>
          </View>
          {(errors.interestRate || errors.loanTenureInMonths) && (
            <Text style={styles.errorText}>{errors.interestRate || errors.loanTenureInMonths}</Text>
          )}
        </View>
      </CustomModal>
    </View>
  );
};

export default Header;