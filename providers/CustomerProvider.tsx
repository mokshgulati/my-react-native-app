import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllUsers, User, updateUserDetails } from '@/lib/appwrite';
import { useLoader } from '@/providers/LoaderProvider';

interface CustomersContextType {
    customers: User[];
    setCustomers: React.Dispatch<React.SetStateAction<User[]>>;
    updateCustomer: (customerId: string, updatedDetails: Partial<User>) => Promise<void>;
    fetchCustomers: () => Promise<void>;
}

const CustomersContext = createContext<CustomersContextType | undefined>(undefined);

export const CustomersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { showLoader, hideLoader } = useLoader();
    const [customers, setCustomers] = useState<User[]>([]);

    const fetchCustomers = async () => {
        try {
            showLoader();
            const fetchedCustomers = await getAllUsers();
            setCustomers(fetchedCustomers);
        } catch (error) {
            console.error('Failed to fetch customers:', error);
        } finally {
            hideLoader();
        }
    };

    const updateCustomer = async (customerId: string, updatedUser: User) => {
        try {
            setCustomers(prevCustomers =>
                prevCustomers.map(customer =>
                    customer.$id === customerId ? { ...customer, ...updatedUser } : customer
                )
            );
        } catch (error) {
            console.error('Failed to update customer:', error);
            throw error;
        }
    };

    return (
        <CustomersContext.Provider value={{ customers, setCustomers, updateCustomer, fetchCustomers }}>
            {children}
        </CustomersContext.Provider>
    );
};

export const useCustomers = () => {
    const context = useContext(CustomersContext);
    if (context === undefined) {
        throw new Error('useCustomers must be used within a CustomersProvider');
    }
    return context;
};