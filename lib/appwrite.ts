import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
    Account,
    Client,
    Databases,
    ID,
    Query,
} from "react-native-appwrite";
// import Realm from 'realm';
// import { realmConfig, RealmUser } from './realm';

export interface User {
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $id: string;
    $permissions: string[];
    $updatedAt: string;
    role: 'admin' | 'user';
    fullName: string;
    email: string;
    phone: string;
    address?: string;
    city?: string;
    state?: string;
    borrowedAmount: number;
    borrowedOn?: string;
    loanStatus: 'active' | 'closed';
    loanTenureInMonths: number;
    totalAmountPaid: number;
    comments?: string;
    paymentHistory?: Payment[] | string[]; // This should be parsed to get the actual objects
}

export interface Payment {
    paymentId: number;
    paymentAmount: number;
    paymentDate: string;
    paymentStatus: string;
}

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.mokshgulati.myapp",
    projectId: "66dbe42a002f1c908392",
    databaseId: "66dbe4f90029288fcb81",
    usersCollectionId: "66dbe535001c17827242",
};

const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

const account = new Account(client);
const databases = new Databases(client);

// Register user
export async function createUser(email: string, password: string) {
    try {

        // Check if the customer account should be created by admin and must be in the database
        const existingUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("email", email)]
        );

        if (existingUser.documents.length === 0) {
            throw new Error("Not a valid customer of DK Group. Contact admin for access.");
        }

        // Create a new account
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
        );

        if (!newAccount) throw new Error("Failed to create account. Try again later.");

        // Sign in the user
        await createSession(email, password);

        await AsyncStorage.setItem('lastAction', 'signedin');

        return existingUser.documents[0];

    } catch (error: any) {
        throw error;
    }
}

// Sign In
export async function signIn(email: string, password: string) {
    try {
        await createSession(email, password);

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("email", email), Query.limit(1)]
        );

        if (currentUser.documents.length === 0) throw new Error("Failed to fetch user details. Try again later.");

        await AsyncStorage.setItem('lastAction', 'signedin');

        return currentUser.documents[0];

    } catch (error: any) {
        throw error;
    }
}

// Create Session
export async function createSession(email: string, password: string) {
    try {
        const session = await account.createEmailPasswordSession(email, password);

        if (!session) throw new Error("Failed to create user session. Try again later.");
        return session;
    } catch (error: any) {
        throw error;
    }
}

// Sign Out
export async function signOut() {
    try {
        await account.deleteSession('current');
    } catch (error: any) {
        console.error('Failed to sign out through network:', error);
    } finally {
        // Clear locally stored session data
        await clearLocalSessionData();
        await AsyncStorage.setItem('lastAction', 'signedout');
        router.replace('/');
    }
}

// Clear local session data
async function clearLocalSessionData() {
    await AsyncStorage.removeItem('session');
}

// Get Account
export async function getAccount() {
    try {
        const currentAccount = await account.get();

        return currentAccount;
    } catch (error: any) {
        throw new Error(`Failed to fetch user account. Try again later. Error: ${error}`);
    }
}

// Get Current User
export async function getCurrentUser() {
    try {
        const currentAccount = await getAccount();

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("email", currentAccount.email), Query.limit(1)]
        );

        if (currentUser.documents.length === 0) throw new Error("Failed to fetch user details. Try again later.");

        return currentUser.documents[0];
    } catch (error: any) {
        throw error;
    }
}

// Get all users
export async function getAllUsers() {
    try {
        // Check if Realm has data
        // const realm = await Realm.open(realmConfig);
        // const users = realm.objects<RealmUser>('RealmUser');

        // if (users.length === 0) {
        // console.log("getAllUsers", "Fetching from database");
        // Fetch from database if Realm is empty
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.notEqual("role", "admin")]
        );

        // Store fetched users in Realm
        // realm.write(() => {
        //     response.documents.forEach((doc) => {
        //         realm.create('RealmUser', {
        //             _id: new Realm.BSON.ObjectId(doc.$id),
        //             name: doc.fullName,
        //             email: doc.email,
        //             role: doc.role,
        //             fullName: doc.fullName,
        //             phone: doc.phone,
        //             address: doc.address,
        //             city: doc.city,
        //             state: doc.state,
        //             borrowedAmount: doc.borrowedAmount,
        //             borrowedOn: doc.borrowedOn,
        //             loanStatus: doc.loanStatus,
        //             loanTenureInMonths: doc.loanTenureInMonths,
        //             totalAmountPaid: doc.totalAmountPaid,
        //             paymentHistory: doc.paymentHistory,
        //             $collectionId: doc.$collectionId,
        //             $databaseId: doc.$databaseId,
        //             $createdAt: doc.$createdAt,
        //             $id: doc.$id,
        //             $permissions: doc.$permissions,
        //             $updatedAt: doc.$updatedAt,
        //         });
        //     });
        // });

        const allUsers = response.documents.map(user => ({
            ...user,
            paymentHistory: Array.isArray(user.paymentHistory) && user.paymentHistory.length > 0
                ? user.paymentHistory.map((paymentStr: string | null) => {
                    if (paymentStr === null) {
                        return null;
                    }

                    try {
                        // Sanitize the string: Add double quotes to keys and remove trailing commas

                        const sanitizedPaymentStr = paymentStr
                            .replace(/([a-zA-Z0-9_]+):/g, '"$1":')  // Add quotes around keys
                            .replace(/,\s*}/g, '}');  // Remove trailing commas before closing braces


                        const formattedPaymentStr = sanitizedPaymentStr.replace(/'/g, '"');

                        const payment: Payment = JSON.parse(formattedPaymentStr);

                        return payment;
                    } catch (e) {
                        console.error("Error parsing payment history string:", e);
                        return null;
                    }
                }).filter(Boolean)  // Filter out null values
                : []  // Return an empty array if paymentHistory is empty or not an array
        })) as User[];

        return allUsers;
        // } else {
        //     // Return users from Realm
        //     console.log("getAllUsers", "Fetching from Realm");
        //     const allUsers = Array.from(users).map(user => ({
        //         ...user,
        //         // borrowedOn: user.borrowedOn ? new Date(user.borrowedOn).toLocaleDateString() : null,
        //         paymentHistory: Array.isArray(user.paymentHistory) && user.paymentHistory.length > 0 
        //             ? user.paymentHistory.map((payment: string) => {
        //                 if (typeof payment === 'string') {
        //                     try {
        //                         return JSON.parse(payment.replace(/'/g, '"'));
        //                     } catch (e) {
        //                         console.error("Error parsing payment history:", e);
        //                         return null;
        //                     }
        //                 }
        //                 return null;  // Return null if it's not a valid string
        //             }).filter(Boolean)  // Filter out null values
        //             : []  // Return an empty array if paymentHistory is empty or not an array
        //     })) as User[]; 

        //     return allUsers;
        // }
    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`);
    }
}

// Add Customer
export async function addCustomerToDatabase(customerData: Partial<User>): Promise<User> {
    try {
        const newCustomer = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                role: 'user',
                fullName: customerData.fullName,
                phone: customerData.phone,
                email: customerData.email,
                address: customerData.address || null,
                city: customerData.city || null,
                state: customerData.state || null,
                borrowedOn: customerData.borrowedOn || new Date().toISOString(),
                borrowedAmount: customerData.borrowedAmount || 0,
                totalAmountPaid: customerData.totalAmountPaid || 0,
                loanTenureInMonths: customerData.loanTenureInMonths || 0,
                loanStatus: customerData.loanStatus || 'active',
                paymentHistory: customerData.paymentHistory || []
            }
        );

        // Add user to Realm
        // const realm = await Realm.open(realmConfig);
        // realm.write(() => {
        //     realm.create('RealmUser', {
        //         _id: new Realm.BSON.ObjectId(newCustomer.$id),
        //         name: newCustomer.fullName,
        //         email: newCustomer.email,
        //         role: newCustomer.role,
        //         fullName: newCustomer.fullName,
        //         phone: newCustomer.phone,
        //         address: newCustomer.address,
        //         city: newCustomer.city,
        //         state: newCustomer.state,
        //         borrowedAmount: newCustomer.borrowedAmount,
        //         borrowedOn: newCustomer.borrowedOn,
        //         loanStatus: newCustomer.loanStatus,
        //         loanTenureInMonths: newCustomer.loanTenureInMonths,
        //         totalAmountPaid: newCustomer.totalAmountPaid,
        //         paymentHistory: newCustomer.paymentHistory,
        //         $collectionId: newCustomer.$collectionId,
        //         $databaseId: newCustomer.$databaseId,
        //         $createdAt: newCustomer.$createdAt,
        //         $id: newCustomer.$id, 
        //         $permissions: newCustomer.$permissions,
        //         $updatedAt: newCustomer.$updatedAt,
        //     });
        // });

        return newCustomer as User;
    } catch (error: any) {
        console.error("Error adding customer:", error);
        throw new Error(`Failed to add customer: ${error.message}`);
    }
}

// Get user details
export async function getUserDetails(userId: string): Promise<User> {
    try {

        const user = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId
        );

        if (Array.isArray(user.paymentHistory) && user.paymentHistory.length > 0) {
            user.paymentHistory = user.paymentHistory.map((paymentStr: string | null) => {
                if (paymentStr === null) {
                    return null;
                }

                try {
                    // Sanitize the string: Add double quotes to keys and remove trailing commas

                    const sanitizedPaymentStr = paymentStr
                        .replace(/([a-zA-Z0-9_]+):/g, '"$1":')  // Add quotes around keys
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
            user.paymentHistory = [];
        }

        return user as User;
    } catch (error: any) {
        throw new Error(`Failed to fetch user details: ${error.message}`);
    }
}

// Update user details
export async function updateUserDetails(userId: string, updatedData: Partial<User>): Promise<User> {
    try {
        const updatedUser = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            userId,
            updatedData
        );
        return updatedUser as User;
    } catch (error: any) {
        console.error("Error updating user details:", error);
        throw new Error(`Failed to update user details: ${error.message}`);
    }
}

// Add transaction
export async function addTransaction(detailsOfUser: User, transactionData: Payment): Promise<User> {
    try {
        const updatedPaymentHistory = [...(detailsOfUser.paymentHistory || []), transactionData];
        const updatedPaymentHistoryString = updatedPaymentHistory.map(payment => JSON.stringify(payment));
        const updatedTotalAmountPaid = detailsOfUser.totalAmountPaid + transactionData.paymentAmount;

        const updatedUser = await updateUserDetails(detailsOfUser.$id, {
            paymentHistory: updatedPaymentHistoryString as string[],
            totalAmountPaid: updatedTotalAmountPaid,
        });

        return updatedUser;
    } catch (error: any) {
        throw new Error(`Failed to add transaction: ${error.message}`);
    }
}