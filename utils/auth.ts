export const checkIsAdmin = (user: any) => {
  return user?.role === 'admin';
};
