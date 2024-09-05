import { StyleSheet } from 'react-native';

export const indexStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'F5F5F5'
    },
    logo: {
        width: 250,
        height: 150,
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
        // boxShadow: '0px 0px 10px rgba(100,120,189,0.3)'
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
    container: {
        flex: 1,
        padding: 20
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgb(204, 204, 204)',
        backgroundColor: 'rgb(226, 223, 223)',
        borderRadius: 10,
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
    paymentCard: {
        padding: 15,
        marginBottom: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgb(204 204 204)',
        flexDirection: 'row'
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
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusTag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
        marginRight: 5,
    },
    statusText: {
        fontWeight: 'bold',
        marginLeft: 5,
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
    saveButton: {
        fontSize: 16,
        color: 'rgb(23,43,109)',
        fontWeight: 'bold',
        borderColor: 'rgb(23,43,109)',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5
    },
});


export const headerStyles = StyleSheet.create({
    headerContainer: {
        padding: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgb(182, 180, 180)',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginLeft: 5
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "black",
        fontWeight: '500',
        borderWidth: 0,
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
    input: {
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
        width: '100%',
    },
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 10
    },
    closeText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: 'rgb(23,43,109)',
        borderRadius: 50,
        padding: 8,
        paddingLeft: 13,
        paddingRight: 13,
        marginLeft: 10,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',
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
    filterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgb(182, 180, 180)',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    filterText: {
        marginLeft: 5,
        color: 'rgb(182, 180, 180)',
        fontSize: 16,
    },
    menuOptionText: {
        padding: 10,
        fontSize: 16,
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
    container: {
        flex: 1,
        backgroundColor: 'F5F5F5',
        justifyContent: 'center'
    },
    rowWrapper: {
        alignItems: 'center',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 10,
        width: '87%',
        borderRadius: 10
    },
    leftColumn: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    rightColumn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nameText: {
        fontWeight: 'bold',
        color: 'gray',
        fontSize: 16,
    },
    phoneText: {
        color: 'gray',
        fontSize: 14,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    amountText: {
        marginLeft: 10,
        fontSize: 16,
    },
});
