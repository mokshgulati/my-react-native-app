export const validateEmail = (email: string): string => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return 'Email is required';
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

export const validatePhone = (phone: string): string => {
  const phoneRegex = /^[0-9]{10}$/;
  if (!phone.trim()) return 'Phone number is required';
  if (!phoneRegex.test(phone)) return 'Invalid phone number format (10 digits)';
  return '';
};

export const validateAmount = (amount: string): string => {
  const amountRegex = /^\d+(\.\d{1,2})?$/;
  if (!amount.trim()) return 'Amount is required';
  if (!amountRegex.test(amount)) return 'Invalid amount format';
  if (parseFloat(amount) <= 0) return 'Amount must be greater than 0';
  return '';
};