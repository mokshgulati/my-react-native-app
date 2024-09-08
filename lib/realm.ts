// import Realm from 'realm';

// // Define the User schema
// class RealmUser extends Realm.Object {
//   _id!: Realm.BSON.ObjectId;
//   name!: string;
//   email!: string;
//   role!: 'admin' | 'user';
//   fullName!: string;
//   phone!: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   borrowedAmount!: number;
//   borrowedOn?: string;
//   interestRate!: number;
//   loanStatus!: 'active' | 'closed';
//   loanTenureInMonths!: number;
//   totalAmountPaid!: number;
//   paymentHistory?: string[];  // Assuming payment history is stored as an array of strings
//   $collectionId!: string;
//   $databaseId!: string;
//   $createdAt!: string;
//   $id!: string;
//   $permissions!: string[];
//   $updatedAt!: string;

//   static schema = {
//     name: 'User',
//     properties: {
//       _id: 'objectId',
//       name: 'string',
//       email: 'string',
//       role: 'string',
//       fullName: 'string',
//       phone: 'string',
//       address: 'string?',
//       city: 'string?',
//       state: 'string?',
//       borrowedAmount: 'double',
//       borrowedOn: 'string?',
//       interestRate: 'double',
//       loanStatus: 'string',
//       loanTenureInMonths: 'int',
//       totalAmountPaid: 'double',
//       paymentHistory: 'string[]',  // Assuming this is an array of payment details as strings
//       $collectionId: 'string',
//       $databaseId: 'string',
//       $createdAt: 'string',
//       $id: 'string',
//       $permissions: 'string[]',
//       $updatedAt: 'string',
//     },
//     primaryKey: '_id',
//   };
// }

// // Create and export the Realm configuration
// export const realmConfig: Realm.Configuration = {
//   schema: [RealmUser],
// };

// export { RealmUser };