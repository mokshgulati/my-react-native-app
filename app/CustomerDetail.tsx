import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet, Image, TouchableOpacity, Alert, StatusBar, TextInput } from 'react-native';
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
import { ActivityIndicator } from 'react-native';
import { validateEmail, validatePhone, validateAmount, validateLoanTenure, validateDate } from '@/utils/validation';
import { deleteUser } from '@/lib/appwrite';
import { Ionicons } from '@expo/vector-icons';


export default function CustomerDetailsScreen() {
  const router = useRouter();
  const { updateCustomer, deleteCustomer } = useCustomers();
  const { customerId = null, } = useLocalSearchParams();
  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();
  const { handleLogout, user } = useSession();
  const { role = 'user' } = user;

  const [comments, setComments] = useState('');
  const [isEditingComments, setIsEditingComments] = useState(false);
  const [isSavingComments, setIsSavingComments] = useState(false);

  const [editingSections, setEditingSections] = useState<Record<string, boolean>>({});
  const [editedFields, setEditedFields] = useState<Partial<User>>({});
  const [editedErrors, setEditedErrors] = useState<Record<string, string>>({});

  const handleCancelEdit = (section: string) => {
    setEditingSections(prev => ({ ...prev, [section]: false }));
    setEditedFields({});
    setEditedErrors({});
  };

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
        setDetails(userData);
        setComments(userData.comments || '');
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

  const handleDeleteCustomer = async (id: string) => {
    try {
      showLoader();
      if (id) {
        await deleteUser(id);
        deleteCustomer(id);
        showToast("Customer deleted successfully", "success");
        router.back();
      }
    } catch (error: any) {
      showToast(`Error deleting customer: ${error.message}`, "error");
    } finally {
      hideLoader();
    }
  }

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const formatDateForDB = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('.')[0]; // Returns YYYY-MM-DDTHH:mm:ss
  };

  const onDeleteCustomer = async () => {
    Alert.alert(
      "Delete Customer",
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteCustomer(details.$id)
        }
      ]
    );
  };

  const toggleSectionEditing = (section: string) => {
    setEditingSections(prev => ({ ...prev, [section]: !prev[section] }));
    if (!editingSections[section]) {
      // When entering edit mode, populate editedFields with current values
      setEditedFields(prev => ({
        ...prev,
        ...Object.keys(details || {}).reduce((acc, key) => {
          if (['email', 'phone', 'address', 'city', 'state', 'borrowedAmount', 'borrowedOn', 'loanTenureInMonths'].includes(key)) {
            // @ts-ignore
            acc[key as keyof User] = details[key as keyof User];
          }
          return acc;
        }, {} as Partial<User>)
      }));
    }
  };

  const handleFieldChange = (field: keyof User, value: string) => {
    let formattedValue: string | number = value;
    if (field === 'borrowedAmount' || field === 'loanTenureInMonths') {
      formattedValue = value === '' || isNaN(parseFloat(value)) ? '' : parseFloat(value);
    } else if (field === 'borrowedOn') {
      formattedValue = value === '' ? '' : formatDateForDB(value);
    }
    setEditedFields(prev => ({ ...prev, [field]: formattedValue }));
    validateField(field, value);
  };

  const validateField = (field: keyof User, value: string) => {
    let error = '';
    switch (field) {
      case 'email':
        error = value.trim() === '' ? 'Email is required' : validateEmail(value);
        break;
      case 'phone':
        error = value.trim() === '' ? 'Phone is required' : validatePhone(value);
        break;
      case 'borrowedAmount':
        error = value.trim() === '' ? 'Borrowed amount is required' : validateAmount(value);
        break;
      case 'loanTenureInMonths':
        error = value.trim() === '' ? 'Loan tenure is required' : validateLoanTenure(value);
        break;
      case 'borrowedOn':
        error = value.trim() === '' ? 'Borrowed date is required' : validateDate(value);
        break;
      // Add more validations for other fields as needed
    }
    setEditedErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleSaveSection = async (section: string) => {
    if (!details) return;

    // function to check if the field is valid
    const sectionFields = Object.keys(editedFields).filter(key => {
      switch (section) {
        case 'personal':
          return ['email', 'phone'].includes(key);
        case 'address':
          return ['address', 'city', 'state'].includes(key);
        case 'loan':
          return ['borrowedAmount', 'borrowedOn', 'loanTenureInMonths'].includes(key);
        default:
          return false;
      }
    });

    const hasErrors = sectionFields.some(field => editedErrors[field]);
    if (hasErrors) {
      showToast('Please correct the errors before saving', 'error');
      return;
    }

    setIsSavingComments(true);
    try {
      const updatedFields = Object.keys(editedFields).reduce((acc, key) => {
        if (editedFields[key as keyof User] !== details[key as keyof User]) {
          // @ts-ignore
          acc[key as keyof User] = editedFields[key as keyof User];
        }
        return acc;
      }, {} as Partial<User>);

      if (Object.keys(updatedFields).length > 0) {
        const updatedUser = await updateUserDetails(details.$id, updatedFields);

        await updateCustomer(details.$id, updatedUser);

        if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
          updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
            if (paymentStr === null) {
              return null;
            }

            try {
              // Sanitize the string: Add double quotes to keys and remove trailing commas

              const sanitizedPaymentStr = paymentStr
                .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')  // Add quotes around keys
                .replace(/,\s*}/g, '}');  // Remove trailing commas before closing braces


              const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

              const payment: Payment = JSON.parse(formattedPaymentStr);

              return payment;
            } catch (e) {
              console.error("Error parsing payment history string:", e);
              return null;
            }
          }).filter(Boolean)  // Filter out null values
        } else {
          updatedUser.paymentHistory = [];
        }

        setDetails(updatedUser);
        showToast('Section updated successfully', 'success');
      }
      toggleSectionEditing(section);
    } catch (error: any) {
      showToast(`Error saving section: ${error.message}`, 'error');
    } finally {
      setIsSavingComments(false);
    }
  };

  const handleSaveComments = async () => {
    if (!details) return;

    if (comments === details.comments) {
      setIsEditingComments(false);
      return;
    }

    setIsSavingComments(true);
    try {
      const updatedUser = await updateUserDetails(details.$id, { comments });
      await updateCustomer(details.$id, updatedUser);

      if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
        updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
          if (paymentStr === null) {
            return null;
          }

          try {
            // Sanitize the string: Add double quotes to keys and remove trailing commas

            const sanitizedPaymentStr = paymentStr
              .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')  // Add quotes around keys
              .replace(/,\s*}/g, '}');  // Remove trailing commas before closing braces


            const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

            const payment: Payment = JSON.parse(formattedPaymentStr);

            return payment;
          } catch (e) {
            console.error("Error parsing payment history string:", e);
            return null;
          }
        }).filter(Boolean)  // Filter out null values
      } else {
        updatedUser.paymentHistory = [];
      }
      setDetails(updatedUser);

      showToast('Comments saved successfully', 'success');
      setIsEditingComments(false);
    } catch (error: any) {
      showToast(`Error saving comments: ${error.message}`, 'error');
    } finally {
      setIsSavingComments(false);
    }
  };

  const handleUserDetailsUpdate = async (updatedDetails: Partial<User>) => {
    if (!details) return;

    try {
      const updatedUser = await updateUserDetails(details.$id, updatedDetails);
      await updateCustomer(details.$id, updatedUser);

      if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
        updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
          if (paymentStr === null) {
            return null;
          }

          try {
            // Sanitize the string: Add double quotes to keys and remove trailing commas

            const sanitizedPaymentStr = paymentStr
              .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')  // Add quotes around keys
              .replace(/,\s*}/g, '}');  // Remove trailing commas before closing braces


            const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

            const payment: Payment = JSON.parse(formattedPaymentStr);

            return payment;
          } catch (e) {
            console.error("Error parsing payment history string:", e);
            return null;
          }
        }).filter(Boolean)  // Filter out null values
      } else {
        updatedUser.paymentHistory = [];
      }

      setDetails(updatedUser);
      showToast('Status updated successfully', 'success');
    } catch (error: any) {
      showToast(`Error updating status: ${error.message}`, 'error');
    }
  };

  // const handlePaymentStatusToggle = async (id: number, newStatus: string) => {
  //   if (!details) return;

  //   try {
  //     const updatedPaymentHistory = details.paymentHistory?.map((payment: Payment | string) => {
  //       let paymentObj: Payment = payment as Payment;
  //       if (paymentObj.paymentId === id) {
  //         paymentObj = { ...paymentObj, paymentStatus: newStatus };
  //       }
  //       return JSON.stringify(paymentObj);
  //     });

  //     const updatedUser = await updateUserDetails(details.$id, {
  //       paymentHistory: updatedPaymentHistory,
  //     });


  //     if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
  //       updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
  //         if (paymentStr === null) {
  //           return null;
  //         }

  //         try {
  //           // Sanitize the string: Add double quotes to keys and remove trailing commas

  //           const sanitizedPaymentStr = paymentStr
  //             .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')  // Add quotes around keys
  //             .replace(/,\s*}/g, '}');  // Remove trailing commas before closing braces


  //           const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

  //           const payment: Payment = JSON.parse(formattedPaymentStr);

  //           return payment;
  //         } catch (e) {
  //           console.error("Error parsing payment history string:", e);
  //           return null;
  //         }
  //       }).filter(Boolean)  // Filter out null values
  //     } else {
  //       updatedUser.paymentHistory = [];
  //     }

  //     setDetails(updatedUser);
  //     showToast('Payment status updated successfully', 'success');
  //   } catch (error: any) {
  //     showToast(`Error updating payment status: ${error.message}`, 'error');
  //   }
  // };

  const handleAddTransaction = async (transactionData: Payment) => {
    if (!details) return;

    try {
      const updatedUser = await addTransaction(details, transactionData);
      console.log("updatedUserrrrrrrr", updatedUser);
      if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
        updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
          if (paymentStr === null) {
            return null;
          }

          try {
            // Sanitize the string: Add double quotes to keys and remove trailing commas
            console.log("paymentStr", paymentStr);
            const sanitizedPaymentStr = paymentStr
              .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')  // Add quotes around keys
              .replace(/,\s*}/g, '}')  // Remove trailing commas before closing braces

            console.log("sanitizedPaymentStr", sanitizedPaymentStr);
            const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

            console.log("formattedPaymentStr", formattedPaymentStr);
            const payment: Payment = JSON.parse(formattedPaymentStr);
            console.log("payment", payment);

            return payment;
          } catch (e) {
            console.error("Error parsing payment history string:", e);
            return null;
          }
        }).filter(Boolean)  // Filter out null values
          .sort((a: Payment, b: Payment) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
      } else {
        updatedUser.paymentHistory = [];
      }

      setDetails(updatedUser);
      setIsTransactionModalVisible(false);
      showToast('Transaction added successfully', 'success');
    } catch (error: any) {
      showToast(`Error adding transaction: ${error.message}`, 'error');
    }
  };

  const handleLoanStatusChange = (status: string) => {
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

  const handleEditTransaction = async (paymentId: number, updatedTransaction: Payment) => {
    if (!details) return;

    try {
      const updatedPaymentHistory = details.paymentHistory?.map((payment: Payment | string) => {
        if (typeof payment === 'object' && payment.paymentId === paymentId) {
          return updatedTransaction;
        }
        return payment;
      });

      const updatedUser = await updateUserDetails(details.$id, {
        paymentHistory: updatedPaymentHistory?.map(payment => JSON.stringify(payment)),
        // @ts-ignore
        totalAmountPaid: details.totalAmountPaid - (details.paymentHistory?.find(p => p.paymentId === paymentId)?.paymentAmount || 0) + updatedTransaction.paymentAmount,
      });

      if (Array.isArray(updatedUser.paymentHistory) && updatedUser.paymentHistory.length > 0) {
        updatedUser.paymentHistory = updatedUser.paymentHistory.map((paymentStr) => {
          if (paymentStr === null) {
            return null;
          }

          try {
            const sanitizedPaymentStr = paymentStr
              .replace(/(?<=\{|,)(\w+)(?=:)/g, '"$1"')
              .replace(/,\s*}/g, '}');

            const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

            const payment: Payment = JSON.parse(formattedPaymentStr);

            return payment;
          } catch (e) {
            console.error("Error parsing payment history string:", e);
            return null;
          }
        }).filter(Boolean)
      } else {
        updatedUser.paymentHistory = [];
      }

      setDetails(updatedUser);
      showToast('Transaction updated successfully', 'success');
    } catch (error: any) {
      showToast(`Error updating transaction: ${error.message}`, 'error');
    }
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
      <ScrollView contentContainerStyle={[styles.scrollContent,
      { paddingBottom: role === 'admin' ? 80 : 20 } // Add extra padding for admin
      ]}>
        {details && (
          <>
            <View style={styles.card}>
              <View style={styles.avatarContainer}>
                {role === 'admin' ? (
                  <TouchableOpacity style={styles.deleteButton} onPress={onDeleteCustomer}>
                    <FontAwesome name="trash" size={24} color="#C7253E" />
                  </TouchableOpacity>
                ) : null}
                <Image source={require('@/assets/images/profile.png')} style={styles.avatar} resizeMode="contain" />
                <Text style={styles.name}>{details.fullName}</Text>
              </View>
              <View style={styles.detailsContainer}>

                <DetailSection
                  title="Personal Information"
                  isEditing={editingSections['personal']}
                  onToggleEdit={() => toggleSectionEditing('personal')}
                  onSave={() => handleSaveSection('personal')}
                  onCancel={() => handleCancelEdit('personal')}
                  isAdmin={role === 'admin'}
                >
                  <DetailItem
                    icon="envelope"
                    label="Email"
                    value={details.email}
                    finalValue={details.email}
                    isEditing={false}
                  />
                  <DetailItem
                    icon="phone"
                    label="Phone"
                    value={editedFields.phone}
                    finalValue={details.phone}
                    isEditing={editingSections['personal']}
                    onChangeText={(value) => handleFieldChange('phone', value)}
                    error={editedErrors.phone}
                  />
                </DetailSection>

                <DetailSection
                  title="Address"
                  isEditing={editingSections['address']}
                  onToggleEdit={() => toggleSectionEditing('address')}
                  onSave={() => handleSaveSection('address')}
                  isAdmin={role === 'admin'}
                  onCancel={() => handleCancelEdit('address')}
                >
                  <DetailItem
                    icon="home"
                    label="Address"
                    value={editedFields.address}
                    finalValue={details.address}
                    isEditing={editingSections['address']}
                    onChangeText={(value) => handleFieldChange('address', value)}
                  />
                  <DetailItem
                    icon="building"
                    label="City"
                    value={editedFields.city}
                    finalValue={details.city}
                    isEditing={editingSections['address']}
                    onChangeText={(value) => handleFieldChange('city', value)}
                  />
                  <DetailItem
                    icon="map"
                    label="State"
                    value={editedFields.state}
                    finalValue={details.state}
                    isEditing={editingSections['address']}
                    onChangeText={(value) => handleFieldChange('state', value)}
                  />
                </DetailSection>

                <DetailSection
                  title="Loan Details"
                  isEditing={editingSections['loan']}
                  onToggleEdit={() => toggleSectionEditing('loan')}
                  onSave={() => handleSaveSection('loan')}
                  isAdmin={role === 'admin'}
                  onCancel={() => handleCancelEdit('loan')}
                >
                  <DetailItem
                    icon="rupee"
                    label="Borrowed Amount"
                    value={editedFields.borrowedAmount}
                    finalValue={details.borrowedAmount}
                    isEditing={editingSections['loan']}
                    onChangeText={(value) => handleFieldChange('borrowedAmount', value)}
                    error={editedErrors.borrowedAmount}
                    keyboardType="decimal-pad"
                  />
                  <DetailItem
                    icon="calendar"
                    label="Borrowed On"
                    value={editingSections['loan'] ? formatDateForDisplay(editedFields.borrowedOn || details.borrowedOn) : formatDateForDisplay(details.borrowedOn)}
                    finalValue={formatDateForDisplay(details.borrowedOn)}
                    isEditing={editingSections['loan']}
                    onChangeText={(value) => handleFieldChange('borrowedOn', value)}
                    error={editedErrors.borrowedOn}
                  />
                  <DetailItem
                    icon="clock-o"
                    label="Loan Tenure"
                    value={editedFields.loanTenureInMonths}
                    finalValue={details.loanTenureInMonths}
                    isEditing={editingSections['loan']}
                    onChangeText={(value) => handleFieldChange('loanTenureInMonths', value)}
                    error={editedErrors.loanTenureInMonths}
                    keyboardType="decimal-pad"
                  />
                  <DetailItem
                    icon="money"
                    label="Total Amount Paid"
                    value={details.totalAmountPaid}
                    finalValue={details.totalAmountPaid}
                    isEditing={false}
                  />
                  <DetailItem
                    icon="money"
                    label="Remaining Amount"
                    value={`₹${(details.borrowedAmount || 0) - (details.totalAmountPaid || 0)}`}
                    finalValue={`₹${(details.borrowedAmount || 0) - (details.totalAmountPaid || 0)}`}
                    isEditing={false}
                  />
                </DetailSection>

                {role === 'admin' && (
                  <DetailSection
                    title="Admin Comments"
                    isEditing={false}
                    onToggleEdit={() => { }}
                    onSave={() => { }}
                    isAdmin={false}
                    onCancel={() => { }}
                  >
                    <View style={styles.commentContainer}>
                      {isEditingComments ? (
                        <>
                          <TextInput
                            style={styles.commentInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Add comments about this customer..."
                            value={comments}
                            onChangeText={setComments}
                          />
                          <View style={styles.commentButtonsContainer}>
                            <TouchableOpacity
                              style={styles.cancelSaveCommentButton}
                              onPress={() => {
                                setComments('');
                                setIsEditingComments(false);
                              }}
                              disabled={isSavingComments}
                            >
                              <Text style={styles.saveCommentButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.saveCommentButton}
                              onPress={handleSaveComments}
                              disabled={isSavingComments}
                            >
                              {isSavingComments ? (
                                <ActivityIndicator size="small" color="#ffffff" />
                              ) : (
                                <Text style={styles.saveCommentButtonText}>Save</Text>
                              )}
                            </TouchableOpacity>
                          </View>
                        </>
                      ) : (
                        <View style={styles.commentTextContainer}>
                          <Text style={styles.commentText}>{details.comments || 'No comments'}</Text>
                          <TouchableOpacity onPress={() => { setComments(details.comments); setIsEditingComments(true); }}>
                            <FontAwesome name="pencil" size={20} color="#4A90E2" />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </DetailSection>
                )}

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
              ? details.paymentHistory
                // @ts-ignore
                .sort((a: Payment, b: Payment) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
                .map((payment: Payment | string, index: number) => {
                  if (typeof payment === 'object') {
                    return (
                      <PaymentCard
                        key={index}
                        payment={payment}
                        isAdmin={role === 'admin'}
                        onEditAmount={handleEditTransaction}
                      />
                    );
                  }
                  return null;
                }).filter(Boolean)  // Filter out null values
              : <Text style={styles.noPaymentsText}>No payment history available</Text>
            }
          </>
        )}
      </ScrollView>
      {role === 'admin' && (
        <View style={styles.addTransactionContainer}>
          <TouchableOpacity
            style={styles.addTransactionButton}
            onPress={() => setIsTransactionModalVisible(true)}
          >
            <Text style={styles.addTransactionButtonText}>Add Transaction</Text>
          </TouchableOpacity>
        </View>
      )}
      {role === 'admin' && (
        <TransactionModal
          visible={isTransactionModalVisible}
          onClose={() => setIsTransactionModalVisible(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </SafeAreaView>
  );
}

const DetailSection = ({
  title = "TITLE",
  children = <></>,
  isEditing = false,
  onToggleEdit = () => { },
  onSave = () => { },
  onCancel = () => { },
  isAdmin = false
}: {
  title: string,
  children: React.ReactNode,
  isEditing: boolean,
  onToggleEdit: () => void,
  onSave: () => void,
  onCancel: () => void,
  isAdmin: boolean
}) => (
  <View style={styles.detailSection}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {isAdmin && (
        isEditing ? (
          <View style={styles.editButtonsContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={onToggleEdit} style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        )
      )}
    </View>
    {children}
  </View>
);

const DetailItem = ({ icon, label, value, finalValue, isEditing, onChangeText, error, keyboardType }: {
  icon: string,
  label: string,
  value: string | number,
  finalValue: string | number,
  isEditing?: boolean,
  onChangeText?: (text: string) => void,
  error?: string,
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'number-pad' | 'decimal-pad'
}) => (
  <View style={styles.detailItem}>
    <FontAwesome name={icon} size={18} color="#4A90E2" style={styles.detailIcon} />
    <View style={styles.detailTextContainer}>
      <Text style={styles.detailLabel}>{label}</Text>
      {isEditing ? (
        <>
          <TextInput
            style={[styles.detailInput, error ? { borderWidth: 1, borderColor: 'red', padding: 5, borderRadius: 5 } : null]}
            value={value?.toString() || ''}
            onChangeText={onChangeText}
            placeholder={`Enter ${label.toLowerCase()}`}
            keyboardType={keyboardType || 'default'}
          />
          {error && <Text style={{ color: 'red' }}>{error}</Text>}
        </>
      ) : (
        <Text style={styles.detailValue}>{finalValue || 'N/A'}</Text>
      )}
    </View>
  </View>
);

const PaymentCard = ({ payment, isAdmin, onEditAmount }: { payment: Payment, isAdmin: boolean, onEditAmount: (id: number, newAmount: Payment) => void }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const handleEditTransaction = (updatedTransaction: Payment) => {
    onEditAmount(payment.paymentId, updatedTransaction);
    setIsEditModalVisible(false);
  };

  return (
    <View style={styles.paymentCard}>
      <View style={styles.paymentLeftSection}>
        <View style={styles.paymentIconContainer}>
          <FontAwesome name="credit-card" size={24} color="#4A90E2" />
        </View>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentAmount}>₹{payment.paymentAmount.toLocaleString()}</Text>
          <Text style={styles.paymentDate}>
            {new Date(payment.paymentDate).toLocaleString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
      </View>
      <View style={styles.paymentRightSection}>
        <StatusTag />
        {isAdmin && (
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" size={24} color="#555" />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption onSelect={() => setIsEditModalVisible(true)}>
                <View style={styles.menuOption}>
                  <Ionicons name="pencil" size={18} color="#4A90E2" />
                  <Text style={styles.menuOptionText}>Edit</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </View>
      <TransactionModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        onSubmit={handleEditTransaction}
        initialData={payment}
        isEditing={true}
      />
    </View>
  );
};

const StatusTag = ({ status = 'paid' }: { status?: string }) => {
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