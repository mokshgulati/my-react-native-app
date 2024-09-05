import React, { useState } from 'react';
import { View, TextInput, Modal, TouchableOpacity, Text } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { headerStyles as styles } from '@/assets/styles/css';

interface HeaderProps {
  onSearch: (text: string) => void;
  addCustomer: (customerData: any) => Promise<void>;
  handleFilterChange: (status: string) => void
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

  const handleSearchChange = (text: string) => {
    setLocalSearchText(text);
    onSearch(text);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerData({ ...customerData, [field]: value });
  };

  const handleAddCustomer = () => {
    addCustomer(customerData);
    setModalVisible(false);
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

  const handleCloseModal = () => {
    setModalVisible(false);
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
  const handleFilterSelect = (selectedFilter: string) => {
    handleFilterChange(selectedFilter);
  };

  return (
    <View>
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
        <View style={styles.inputContainer}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={18} color="rgb(182, 180, 180)" />
            <TextInput style={styles.searchInput} placeholder="Search here..." placeholderTextColor="rgb(182, 180, 180)" value={localSearchText} onChangeText={handleSearchChange} underlineColorAndroid="transparent" selectionColor="rgb(100,120,189)" />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={handleCloseModal} >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color="gray" />
              </TouchableOpacity>
              <TextInput style={styles.input} placeholder="Name" value={customerData.name} onChangeText={(text) => handleInputChange('name', text)} />
              <TextInput style={styles.input} placeholder="Phone" value={customerData.phone} onChangeText={(text) => handleInputChange('phone', text)} />
              <TextInput style={styles.input} placeholder="Email" value={customerData.email} onChangeText={(text) => handleInputChange('email', text)} />
              <TextInput style={styles.input} placeholder="Amount" value={customerData.amount} onChangeText={(text) => handleInputChange('amount', text)} />
              <TextInput style={styles.input} placeholder="Tenure" value={customerData.tenure} onChangeText={(text) => handleInputChange('tenure', text)} />
              <TextInput style={styles.input} placeholder="ROI" value={customerData.roi} onChangeText={(text) => handleInputChange('roi', text)} />
              <TextInput style={styles.input} placeholder="Address" value={customerData.address} onChangeText={(text) => handleInputChange('address', text)} />
              <TouchableOpacity style={styles.popupAddBtn} onPress={handleAddCustomer}>
                <Text style={styles.popupAddButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};


export default Header;
