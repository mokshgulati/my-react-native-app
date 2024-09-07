import {
    Account,
    Client,
    Databases,
    ID,
    Query,
} from "react-native-appwrite";

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
export async function createUser(email: string, password: string, username: string) {
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
            username
        );

        if (!newAccount) throw new Error("Failed to create account. Try again later.");

        // Sign in the user
        await signIn(email, password);

        return existingUser.documents[0];





        // const newUser = await databases.createDocument(
        //     appwriteConfig.databaseId,
        //     appwriteConfig.usersCollectionId,
        //     ID.unique(),
        //     {
        //         accountId: newAccount.$id,
        //         email: email,
        //         username: username,
        //     }
        // );

        // return newUser;
    } catch (error: any) {
        throw error;
    }
}

// Sign In
export async function signIn(email: string, password: string) {
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
        const session = await account.deleteSession("current");

        return session;
    } catch (error: any) {
        throw new Error(error);
    }
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
            [Query.equal("email", currentAccount.email)]
        );

        if (currentUser.documents.length === 0) throw new Error("Failed to fetch user details. Try again later.");

        return currentUser.documents[0];
    } catch (error: any) {
        throw error;
    }
}

// Create Video Post
export async function createVideoPost(form: any) {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            '',''
            // uploadFile(form.thumbnail, "image"),
            // uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                title: form.title,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                prompt: form.prompt,
                creator: form.userId,
            }
        );

        return newPost;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Get all video Posts
export async function getAllPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId
        );

        return posts.documents;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Get video posts created by user
export async function getUserPosts(userId: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("creator", userId)]
        );

        return posts.documents;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Get video posts that matches search query
export async function searchPosts(query: string) {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.search("title", query)]
        );

        if (!posts) throw new Error("Something went wrong");

        return posts.documents;
    } catch (error: any) {
        throw new Error(error);
    }
}

// Get latest created video posts
export async function getLatestPosts() {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.orderDesc("$createdAt"), Query.limit(7)]
        );

        return posts.documents;
    } catch (error: any) {
        throw new Error(error);
    }
}