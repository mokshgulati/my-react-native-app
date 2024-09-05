import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLoader } from '@/providers/LoaderProvider';
import { useToast } from '@/providers/ToastProvider';
import { loginStyles as styles } from '@/assets/styles/css';
import { useRouter } from 'expo-router';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = useState(false); // Toggle between login/signup mode
  const [focusedInput, setFocusedInput] = useState(""); // Track focused input field
  const [email, setEmail] = useState(""); // Email input state
  const [password, setPassword] = useState(""); // Password input state

  const { showLoader, hideLoader } = useLoader(); // Show and hide loader
  const showToast = useToast(); // Show toast messages
  const router = useRouter(); // Expo Router for navigation

  // Regex for validating email and password
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Handle login or signup
  const handleLogin = async () => {
    // if (!emailRegex.test(email)) {
    //   showToast('Please enter a valid email address', 'error');
    //   return;
    // }
    // if (!passwordRegex.test(password)) {
    //   showToast('Password must be at least 8 characters long and contain one uppercase letter, one lowercase letter, one number, and one special character.', 'error');
    //   return;
    // }

    showLoader();
    try {
      const response = await fakeApiCall(email, password);

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

  // Simulate an API call to login
  const fakeApiCall = (email: string, password: string) => {
    return new Promise<{ success: boolean; type: string }>((resolve) => {
      setTimeout(() => {
        // Mock response: returns admin or user based on the email (for testing)
        const userType = email.includes("admin") ? 'admin' : 'user';
        resolve({ success: true, type: userType });
      }, 1000);
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/DKLogo.png')} style={styles.logo} resizeMode="contain" />
      <Text style={styles.heading}>{isSignup ? 'Sign Up to create account' : 'Login now'}</Text>

      {isSignup && (
        <TextInput
          style={[styles.input, focusedInput === 'name' && styles.inputFocused]}
          placeholder="Name"
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
          <TouchableOpacity>
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
  );
};

export default Login;
