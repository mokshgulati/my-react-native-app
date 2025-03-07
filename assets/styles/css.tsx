import { StyleSheet } from 'react-native';

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F5F5F5'
    },
    logo: {
        width: 240,
        height: 240,
        marginBottom: 40,
    },
    heading: {
        color: 'rgb(3,103,191)',
        fontSize: 25,
        fontWeight: '500',
        marginBottom: 40
    },
    input: {
        width: '100%',
        padding: 16,
        height: 56,
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: 'rgb(139 135 135)',
        borderRadius: 8,
        marginBottom: 18,
        color: 'rgb(139 135 135)',
        fontSize: 16,
    },
    inputFocused: {
        borderColor: 'rgb(23,43,109)',
    },
    button: {
        backgroundColor: 'rgb(23,43,109)',
        padding: 18,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        fontSize: 26,
        borderRadius: 10,
        marginTop: 25
    },
    buttonText: {
        color: '#fff',
        fontSize: 22,
    },
    forgotPasswordContainer: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingLeft: 10,
    },
    forgotPasswordText: {
        color: 'rgb(87 84 84)',
        marginBottom: 12,
        alignItems: 'flex-start',
        fontSize: 15,
        fontWeight: '500'
    },
    switchText: {
        color: 'rgb(87 84 84)',
        fontSize: 15,
        fontWeight: '500'
    },
    linkText: {
        color: 'rgb(3,103,191)',
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },
});

export const customerDetailStyles = StyleSheet.create({
    editButtonsContainer: {
        flexDirection: 'row',
      },
      cancelButton: {
        marginRight: 10,
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
      },
      cancelButtonText: {
        color: '#333',
      },
      saveButton: {
        padding: 5,
        borderRadius: 5,
        backgroundColor: '#4A90E2',
      },
      saveButtonText: {
        color: '#fff',
      },
    menuOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      menuOptionText: {
        marginLeft: 10,
        fontSize: 16,
      },
    deleteButton: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    headerIcon: {
        width: 24,
        height: 24,
    },
    datePickerButton: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
      },
      modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
      },
      submitButton: {
        backgroundColor: '#4A90E2',
        padding: 10,
        borderRadius: 5,
        width: '45%',
      },
      buttonText: {
        color: '#fff',
        textAlign: 'center',
      },
    keyboardAvoidingView: {
        flex: 1,
      },
      scrollContent: {
        flexGrow: 1,
        padding: 16,
      },
      card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
      },
      detailsContainer: {
        flex: 1,
      },
      detailSection: {
        marginBottom: 20,
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
      },
      editButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
      },
      editButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
      },
      detailIcon: {
        marginRight: 15,
      },
      detailTextContainer: {
        flex: 1,
      },
      detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
      },
      detailValue: {
        fontSize: 16,
        color: '#333',
      },
      detailInput: {
        fontSize: 16,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#4A90E2',
        paddingVertical: 4,
      },
    commentContainer: {
        marginTop: 10,
      },
      commentInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        padding: 10,
        minHeight: 100,
        textAlignVertical: 'top',
      },
      commentButtonsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      cancelSaveCommentButton: {
        backgroundColor: 'lightgray',
        padding: 10,
        width: '20%',
        borderRadius: 4,
        marginTop: 10,
        alignItems: 'center',
      },
      saveCommentButton: {
        backgroundColor: '#4A90E2',
        padding: 10,
        width: '20%',
        borderRadius: 4,
        marginTop: 10,
        alignItems: 'center',
      },
      saveCommentButtonText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      commentTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      },
      commentText: {
        flex: 1,
        marginRight: 10,
      },
      addTransactionContainer: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
      },
    
      addTransactionButton: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
      },
    
      addTransactionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
    
      noPaymentsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
      },
    paymentCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      paymentLeftSection: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      paymentIconContainer: {
        backgroundColor: '#EBF5FF',
        borderRadius: 8,
        padding: 8,
        marginRight: 12,
      },
      paymentInfo: {
        justifyContent: 'center',
      },
      paymentAmount: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F2937',
      },
      paymentDate: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
      },
      paymentRightSection: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      statusTag: {
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginRight: 8,
      },
      statusTagText: {
        fontSize: 12,
        fontWeight: '600',
      },
      menuTrigger: {
        padding: 8,
      },
    loanStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    loanStatusText: {
        marginLeft: 8,
        marginRight: 8,
        color: '#555',
        fontSize: 16,
    },
    statusSection: {
        marginTop: 20,
    },
    statusLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusTextContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    profilePhoto: {
        height: 36,
        width: 36,
        borderRadius: 18,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    paymentDetails: {
        flex: 1,
    },
    paymentStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    rightContainer: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    amountContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    label: {
        fontSize: 16,
        color: 'black',
    },
    value: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 10,
    },
    paymentleftContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    paymentlabel: {
        fontWeight: 'bold',
    },
    paymentvalue: {
        marginBottom: 5,
    },
    paymentrightContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
        flex: 1,
    },
    dateContainer: {
        flexDirection: 'row'
    },
    dateLabel: {
        fontSize: 12,
        color: 'gray',
    },
    dateValue: {
        marginBottom: 5,
        fontSize: 12,
    },
    paid: {
        backgroundColor: '#d4edda',
        borderColor: '#28a745',
    },
    delayed: {
        backgroundColor: '#f8d7da',
        borderColor: '#dc3545',
    },
    pending: {
        backgroundColor: 'rgb(237 237 190)',
        borderColor: '#17a2b8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgb(204, 204, 204)',
        marginBottom: 20
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export const headerStyles = StyleSheet.create({
    formContainer: {
        marginBottom: 15,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        paddingLeft: 10,
    },
    inputError: {
        borderColor: '#FF6B6B',
    },
    inputIcon: {
        marginRight: 10,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 12,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    headerContainer: {
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 10,
    },
    filterSortContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    filterText: {
        marginLeft: 8,
        marginRight: 8,
        color: '#555',
        fontSize: 16,
    },
    menuOptionText: {
        padding: 10,
        fontSize: 16,
    },
    searchAddContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        paddingLeft: 8,
        fontSize: 16,
        color: '#333',
    },
    addButton: {
        backgroundColor: 'rgb(23,43,109)',
        borderRadius: 5,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        position: 'relative',
        top: -2
    },
    fullWidthInput: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        fontSize: 16,
    },
    halfWidthInput: {
        width: '48%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    quarterWidthInput: {
        width: '24%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        fontSize: 16,
    },
    marginRight: {
        marginRight: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addCustomerBtn: {
        width: '30%'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    popupAddBtn: {
        backgroundColor: 'rgb(23,43,109)',
        borderRadius: 5,
        padding: 8,
        paddingHorizontal: 20
    },
    popupAddButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    textHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        paddingHorizontal: 20,
        textAlign: 'center'
    },
});

export const loaderStyles = StyleSheet.create({
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});

export const toastStyles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        padding: 10,
        borderRadius: 8,
        zIndex: 1000,
    },
    message: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    success: {
        backgroundColor: 'green',
    },
    error: {
        backgroundColor: 'black',
    },
    info: {
        backgroundColor: 'yellow',
    },
});

export const customersStyles = StyleSheet.create({
    noCustomersContainer: {
        marginTop: '50%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noCustomersText: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerIcon: {
        width: 20,
        height: 20,
    },
    profilePhoto: {
        height: 36,
        width: 36,
        borderRadius: 18,
    },
    scrollView: {
        flex: 1,
    },
    rowWrapper: {
        paddingHorizontal: 15,
        marginBottom: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    leftColumn: {
        flex: 1,
    },
    rightColumn: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontWeight: 'bold',
        color: '#333',
        fontSize: 16,
        marginLeft: 5,
    },
    phoneText: {
        color: '#666',
        fontSize: 14,
        marginLeft: 5,
    },
    dateText: {
        color: '#666',
        fontSize: 14,
        marginLeft: 5,
    },
    amountLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    amountText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    activeStatus: {
        marginTop: 10,
    },
});

export const indexStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        padding: 20,
        paddingTop: 80,
        width: '100%',
    },
    buttonWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 20,
        alignItems: 'center',
        width: '90%',
        marginTop: -100
    },
    btnTxt: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: '600',
        margin: 'auto',
        fontSize: 15
    },
    footer: {
        fontWeight: '600'
    },
});

export const modalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    modalBody: {
        padding: 15,
    },
    modalFooter: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    submitButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        width: '100%',
    },
    popupAddBtn: {
        backgroundColor: 'rgb(23,43,109)',
        borderRadius: 5,
        padding: 8,
        paddingHorizontal: 20
    },
    popupAddButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
});