import React, { useState } from 'react';
import { View } from 'react-native';
import Login from '@/app/Login';
import CustomerDetails from '@/app/CustomerDetail';
import { indexStyles as styles } from '@/assets/styles/css';
import Customers from '@/app/admin/Customers';

export default function Index() {
  const [currentScreen, setCurrentScreen] = useState('Login');
  const [currentType, setCurrentType] = useState('admin');

  const handleLoginSuccess = (type: string | undefined) => {
    if (type === "admin") setCurrentScreen('CustomersList');
    else setCurrentScreen('CustomerDetails');
    setCurrentType(type ?? 'admin')
  };

  const [selectedCustomerId, setSelectedCustomerId] = useState(-1);

  const handleCustomerSelect = (customerId: number) => {
    setSelectedCustomerId(customerId);
    setCurrentScreen('CustomerDetails');
  };

  const handleBackFromDetails = () => {
    setCurrentScreen('CustomersList');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Login':
        return <Login onLoginSuccess={handleLoginSuccess} />;
      case 'CustomersList':
        return <Customers onCustomerSelect={handleCustomerSelect} />;
      case 'CustomerDetails':
        return <CustomerDetails customerId={selectedCustomerId} handleBackFromDetails={handleBackFromDetails} type={currentType} />;
      default:
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return <View style={styles.container}> {renderScreen()} </View>;
}