import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Image, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SomethingWentWrong from '@/components/SomethingWentWrong';
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '@/components/PageHeader';
import { customerDetailStyles as styles } from '@/assets/styles/css';
import TransactionModal from '@/components/TransactionModal';
import { useSession } from '@/providers/SessionProvider';
import { getUserDetails, updateUserDetails, addTransaction, User, Payment } from '@/lib/appwrite';
import { useCustomers } from '@/providers/CustomerProvider';

export default function CustomerDetailsScreen() {
  const router = useRouter();
  const { updateCustomer } = useCustomers();
  const { customerId = null, } = useLocalSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();
  const { handleLogout, user } = useSession();
  const { role = 'user' } = user;

  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(false);
  const [isTransactionModalVisible, setIsTransactionModalVisible] = useState(false);

  const [details, setDetails] = useState<User | null>(null);

  const id = customerId || user?.$id;

  useEffect(() => {
    fetchUserDetails();
  }, [customerId, role]);

  const fetchUserDetails = async () => {
    showLoader();
    setError(false);

    try {
      if (id) {
        const userData = await getUserDetails(id);
        console.log("userDataaaaaa", userData);
        setDetails(userData);
      } else {
        throw new Error('User not found');
      }
    } catch (error: any) {
      setError(true);
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      hideLoader();
    }
  };

  const handleUserDetailsUpdate = async (updatedDetails: Partial<User>) => {
    if (!details) return;

    try {
      const updatedUser = await updateUserDetails(details.$id, updatedDetails);
      await updateCustomer(details.$id, updatedUser);
      setDetails(updatedUser);
      setHasChanges(false);
      showToast('Status updated successfully', 'success');
    } catch (error: any) {
      showToast(`Error updating status: ${error.message}`, 'error');
    }
  };

  const handlePaymentStatusToggle = async (id: number, newStatus: string) => {
    if (!details) return;

    try {
      const updatedPaymentHistory = details.paymentHistory?.map(payment => {
        if (payment.paymentId === id) {
          return { ...payment, paymentStatus: newStatus };
        }
        return payment;
      });

      const updatedUser = await updateUserDetails(details.$id, {
        paymentHistory: updatedPaymentHistory,
      });
      setDetails(updatedUser);
      setHasChanges(false);
      showToast('Payment status updated successfully', 'success');
    } catch (error: any) {
      showToast(`Error updating payment status: ${error.message}`, 'error');
    }
  };

  const handleAddTransaction = async (transactionData: Payment) => {
    if (!details) return;

    try {
      const updatedUser = await addTransaction(details.$id, transactionData);
      setDetails(updatedUser);
      setIsTransactionModalVisible(false);
      setHasChanges(false);
      showToast('Transaction added successfully', 'success');
    } catch (error: any) {
      showToast(`Error adding transaction: ${error.message}`, 'error');
    }
  };

  const handleLoanStatusChange = (status: string) => {
    console.log('Loan status change');
    Alert.alert('Loan status change', 'Are you sure you want to change the loan status?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Change',
        onPress: () => {
          const updatedDetails = { loanStatus: status as 'active' | 'closed' };
          handleUserDetailsUpdate(updatedDetails);
          showToast('Loan status changed', 'success');
        },
      },
    ]);
  };

  if (error) {
    return <SomethingWentWrong onRetry={fetchUserDetails} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <PageHeader
        leftNode={role === 'admin' ? <Image source={require('@/assets/images/back-arrow-100.png')} style={styles.headerIcon} resizeMode="contain" /> : null}
        headerText={role === 'user' ? "My Details" : "Customer Details"}
        rightNode={<TouchableOpacity onPress={handleLogout}><Image style={styles.profilePhoto} source={require('@/assets/images/avatarIconBlue.png')} resizeMode="contain" /></TouchableOpacity>}
        handleOnPressLeftNode={role === 'admin' ? () => router.back() : undefined}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {details && (
          <>
            <View style={styles.card}>
              <View style={styles.avatarContainer}>
                <Image source={require('@/assets/images/profile.png')} style={styles.avatar} resizeMode="contain" />
                <Text style={styles.name}>{details.fullName}</Text>
              </View>
              <View style={styles.detailsContainer}>
                <DetailSection title="Personal Information">
                  <DetailItem icon="envelope" label="Email" value={details.email} />
                  <DetailItem icon="phone" label="Phone" value={details.phone} />
                  {/* <DetailItem icon="user" label="Role" value={details.role} /> */}
                </DetailSection>

                <DetailSection title="Address">
                  <DetailItem icon="home" label="Address" value={details.address} />
                  <DetailItem icon="building" label="City" value={details.city} />
                  <DetailItem icon="map" label="State" value={details.state} />
                </DetailSection>

                <DetailSection title="Loan Details">
                  <DetailItem icon="rupee" label="Borrowed Amount" value={`₹${details.borrowedAmount}`} />
                  <DetailItem icon="calendar" label="Borrowed On" value={details.borrowedOn ? new Date(details.borrowedOn).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'} />
                  <DetailItem icon="clock-o" label="Loan Tenure" value={`${details.loanTenureInMonths ? `${details.loanTenureInMonths} months` : 'N/A'}`} />
                  <DetailItem icon="percent" label="Interest Rate" value={`${details.interestRate}%`} />
                  <DetailItem icon="money" label="Total Amount Paid" value={`₹${details.totalAmountPaid}`} />
                  <DetailItem icon="money" label="Remaining Amount" value={`₹${details.borrowedAmount - details.totalAmountPaid}`} />
                </DetailSection>

                <View style={styles.statusSection}>
                  <Text style={styles.statusLabel}>Loan Status</Text>
                  <View style={styles.statusContainer}>
                    <View style={styles.statusTextContainer}>
                      <FontAwesome
                        name={details.loanStatus === 'active' ? "check-circle" : "times-circle"}
                        size={24}
                        color={details.loanStatus === 'active' ? "#4CAF50" : "#F44336"}
                      />
                      <Text style={[
                        styles.statusText,
                        { color: details.loanStatus === 'active' ? "#4CAF50" : "#F44336" }
                      ]}>
                        {details.loanStatus === 'active' ? "Active" : "Closed"}
                      </Text>
                    </View>
                    {role === 'admin' && (
                      <View>
                        <Menu>
                          <MenuTrigger>
                            <View style={styles.loanStatusContainer}>
                              <FontAwesome name="pencil" size={24} color="gray" />
                              {/* <Text style={styles.loanStatusText}>Edit</Text> */}
                              {/* <FontAwesome name="chevron-down" size={18} color="#555" /> */}
                            </View>
                          </MenuTrigger>
                          <MenuOptions>
                            <MenuOption onSelect={() => handleLoanStatusChange('active')}>
                              <Text style={styles.menuOptionText}>Active</Text>
                            </MenuOption>
                            <MenuOption onSelect={() => handleLoanStatusChange('closed')}>
                              <Text style={styles.menuOptionText}>Closed</Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Payment History</Text>
            {Array.isArray(details.paymentHistory) && details.paymentHistory.length > 0
              ? details.paymentHistory.map((payment: Payment, index: number) => {
                console.log("paymentttttt", payment, typeof payment);
                if (typeof payment === 'object') {
                  return (
                    <PaymentCard
                      key={index}
                      payment={payment}
                      isAdmin={role === 'admin'}
                      onStatusChange={handlePaymentStatusToggle}
                    />
                  );
                }
                return null;
              }).filter(Boolean)  // Filter out null values
              : []}
          </>
        )}
      </ScrollView>
      {/* {role === 'admin' && (
        <View style={styles.addTransactionContainer}>
          <TouchableOpacity
            style={styles.addTransactionButton}
            onPress={() => setIsTransactionModalVisible(true)}
          >
            <Text style={styles.addTransactionButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )} */}
      {/* {role === 'admin' && (
        <TransactionModal
          visible={isTransactionModalVisible}
          onClose={() => setIsTransactionModalVisible(false)}
          onSubmit={handleAddTransaction}
        />
      )} */}
    </SafeAreaView>
  );
}

const DetailSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <View style={styles.detailSection}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const DetailItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
  <View style={styles.detailItem}>
    <FontAwesome name={icon} size={18} color="#4A90E2" style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const PaymentCard = ({ payment, isAdmin, onStatusChange }: { payment: Payment, isAdmin: boolean, onStatusChange: (id: number, newStatus: string) => void }) => (
  <View style={styles.paymentCard}>
    <View style={styles.paymentLeftSection}>
      <View style={styles.paymentIconContainer}>
        <FontAwesome name="credit-card" size={24} color="#4A90E2" />
      </View>
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentAmount}>₹{payment.paymentAmount.toLocaleString()}</Text>
        <Text style={styles.paymentDate}>{new Date(payment.paymentDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
      </View>
    </View>
    <View style={styles.paymentRightSection}>
      <StatusTag status={payment.paymentStatus} />
      {isAdmin && (
        <Menu>
          <MenuTrigger>
            <View style={styles.menuTrigger}>
              <FontAwesome name="ellipsis-v" size={20} color="#6B7280" />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            <MenuOption onSelect={() => onStatusChange(payment.paymentId, 'paid')} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, }}>
              <FontAwesome name="check" size={16} color="#4CAF50" />
              <Text style={styles.menuOptionText}>Mark as Paid</Text>
            </MenuOption>
            <MenuOption onSelect={() => onStatusChange(payment.paymentId, 'pending')} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, }}>
              <FontAwesome name="clock-o" size={16} color="#FFC107" />
              <Text style={styles.menuOptionText}>Mark as Pending</Text>
            </MenuOption>
            <MenuOption onSelect={() => onStatusChange(payment.paymentId, 'delayed')} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, }}>
              <FontAwesome name="exclamation-circle" size={16} color="#F44336" />
              <Text style={styles.menuOptionText}>Mark as Delayed</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      )}
    </View>
  </View>
);

const StatusTag = ({ status }: { status: string }) => {
  const getStatusColor = () => {
    switch (status?.toLowerCase()) {
      case 'paid': return { bg: '#E6F4EA', text: '#1E8E3E' };
      case 'pending': return { bg: '#FFF8E1', text: '#F9A825' };
      case 'delayed': return { bg: '#FDECEA', text: '#D93025' };
      default: return { bg: '#F3F4F6', text: '#6B7280' };
    }
  };

  const { bg, text } = getStatusColor();

  return (
    <View style={[styles.statusTag, { backgroundColor: bg }]}>
      <Text style={[styles.statusTagText, { color: text }]}>{status?.toUpperCase()}</Text>
    </View>
  );
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
};