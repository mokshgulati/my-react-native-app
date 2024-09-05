import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { loginStyles as styles } from '@/assets/styles/css';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const Login: React.FC = () => {
  const { entry } = useLocalSearchParams(); // Retrieving route parameters
  const [isSignup, setIsSignup] = useState(entry === 'signup'); // Toggle between login/signup mode
  const [focusedInput, setFocusedInput] = useState(""); // Track focused input field
  const [name, setName] = useState(""); // Name input state (for signup)
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state

  const { showLoader, hideLoader } = useLoader(); // Show and hide loader
  const showToast = useToast(); // Show toast messages
  const router = useRouter(); // Expo Router for navigation

  // Regex for validating email, password, and name
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/; // Allows letters and spaces

  // Handle login or signup
  const handleLogin = async () => {
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters long and contain one letter, and one number.','error');
      return;
    }
    if (isSignup && !nameRegex.test(name)) {
      showToast('Please enter a valid name (only letters and spaces)', 'error');
      return
    }

    showLoader();
    try {
      const response = isSignup ? await handleSignup() : await handleSignin();

      if (response.success) {
        if (response.type === 'admin') {
          router.push('/admin/Customers'); // Navigate to Admin Dashboard
        } else {
          router.push('/CustomerDetail'); // Navigate to User Dashboard
        }
      } else {
        showToast('Invalid credentials', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again later.', 'error');
    } finally {
      hideLoader();
    }
  };

  // API Call to handle forgot password
  const handleForgotPassword = () => {
    // Simulate an API call to sign up
  }

  // API Call to handle sign-up
  const handleSignup = () => {
    // Simulate an API call to sign up
    return new Promise<{ success: boolean; type: string }>((resolve) => {
      setTimeout(() => {
        // Mock response: return success and assign user type based on email
        const userType = email.includes("admin") ? 'admin' : 'user';
        resolve({ success: true, type: userType });
      }, 1000);
    });
  };

  // API Call to handle sign-in
    const handleSignin = () => {
    // Simulate an API call to sign in
    return new Promise<{ success: boolean; type: string }>((resolve) => {
      setTimeout(() => {
        // Mock response: return success and assign user type based on email
        const userType = email.includes("admin") ? 'admin' : 'user';
        resolve({ success: true, type: userType });
      }, 1000);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.container}>
        <Image source={require('../assets/images/DKLogo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>{isSignup ? 'Sign Up to create account' : 'Login now'}</Text>

        {isSignup && (
          <TextInput
            style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
            placeholder="Name"
            onChangeText={setName}
            value={name}
            onFocus={() => setFocusedInput('name')}
            onBlur={() => setFocusedInput("")}
          />
        )}
        <TextInput
          style={[styles.input, focusedInput === 'email' && styles.inputFocused]}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput("")}
        />
        <TextInput
          style={[styles.input, focusedInput === 'password' && styles.inputFocused]}
          placeholder="Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          onFocus={() => setFocusedInput('password')}
          onBlur={() => setFocusedInput("")}
        />

        {!isSignup && (
          <View style={styles.forgotPasswordContainer}>
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>{isSignup ? 'Signup' : 'Login'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.switchText}>
            {isSignup ? (
              <>
                <Text>Already have an account?{' '}</Text>
                <Text style={styles.linkText}>Login</Text>
              </>
            ) : (
              <>
                <Text>Don't have an account?{' '}</Text>
                <Text style={styles.linkText}>Sign up</Text>
              </>
            )}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
