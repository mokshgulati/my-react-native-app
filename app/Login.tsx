import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image, StatusBar, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { loginStyles as styles } from '@/assets/styles/css';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createUser, signIn } from '@/lib/appwrite';
import { useSession } from '@/providers/SessionProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkIsAdmin } from '@/utils/auth';

const Login: React.FC = () => {
  const { entry } = useLocalSearchParams(); // Retrieving route parameters
  const [isSignup, setIsSignup] = useState(entry === 'signup'); // Toggle between login/signup mode
  const [focusedInput, setFocusedInput] = useState(""); // Track focused input field
  const [name, setName] = useState(""); // Name input state (for signup)
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirm password input state

  const { showLoader, hideLoader } = useLoader(); // Show and hide loader
  const showToast = useToast(); // Show toast messages
  const router = useRouter(); // Expo Router for navigation
  const { setIsLogged, setUser } = useSession(); // Add this line

  // Regex for validating email, password, and name
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const nameRegex = /^[a-zA-Z\s]+$/; // Allows letters and spaces

  // Handle login or signup
  const handleLogin = async () => {
    if (!validateInputs()) return;

    showLoader();
    try {
      const user = isSignup ? await handleSignup() : await handleSignin();
      if (user) {
        await AsyncStorage.setItem('session', JSON.stringify(user));
        setIsLogged(true);
        setUser(user);
        router.replace(checkIsAdmin(user) ? '/Customers' : '/CustomerDetail');
      } else {
        showToast('Invalid credentials', 'error');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      showToast(error?.message || 'Something went wrong. Please try again later.', 'error');
    } finally {
      hideLoader();
    }
  };

  const validateInputs = () => {
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!passwordRegex.test(password)) {
      showToast('Password must be at least 8 characters long and contain one letter, and one number.', 'error');
      return false;
    }
    if (isSignup) {
      if (!nameRegex.test(name)) {
        showToast('Please enter a valid name (only letters and spaces)', 'error');
        return false;
      }
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return false;
      }
    }
    return true;
  };

  // API Call to handle forgot password
  const handleForgotPassword = () => { }

  // API Call to handle sign-up
  const handleSignup = async () => {
    try {
      const user = await createUser(email, password, name);
      return user;
    } catch (error: any) {
      throw error;
    }
  };

  // API Call to handle sign-in
  const handleSignin = async () => {
    try {
      const user = await signIn(email, password);
      return user;
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Image source={require('../assets/images/DKMainLogo.png')} style={styles.logo} resizeMode="contain" />
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
          {isSignup && (
            <TextInput
              style={[styles.input, focusedInput === 'confirmPassword' && styles.inputFocused]}
              placeholder="Confirm Password"
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              onFocus={() => setFocusedInput('confirmPassword')}
              onBlur={() => setFocusedInput("")}
            />
          )}

          {/* {!isSignup && (
            <View style={styles.forgotPasswordContainer}>
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          )} */}

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
    </TouchableWithoutFeedback>
  );
};

export default Login;
