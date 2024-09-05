import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLoader } from '@/app/providers/LoaderProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { loginStyles as styles } from '@/assets/styles/css';

interface LoginProps {
  onLoginSuccess: (type: string | undefined) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { showLoader, hideLoader } = useLoader();
  const showToast = useToast();

  const handleLogin = async () => {
    showLoader();
    try {
      const response = await fakeApiCall(email, password);
      if (response.success) {
        onLoginSuccess(response.type);
      } else {
        showToast('Invalid credentials', 'error');
      }
    } catch (error) {
      showToast('Something went wrong. Please try again later.', "error");
    } finally {
      hideLoader();
    }
  };

  const fakeApiCall = (email: string, password: string) => {
    return new Promise<{ success: boolean; message?: string, type?: string }>((resolve) => {
      setTimeout(() => {
        // if (email === 'test@example.com' && password === 'password') {
        resolve({ success: true, type: 'admin' });
        // resolve({ success: true , type: 'user'});
        // } else {
        // resolve({ success: false, message: 'Invalid credentials' });
        // }
      }, 1000);
    });
  };

  return (
    <View style={styles.container} >
      <Image source={{ uri: '../assets/images/NewLogo.png' }} style={styles.logo} resizeMode="contain" />
      <Text style={styles.heading}>{isSignup ? 'Sign Up to create account' : 'Login now'}</Text>
      {isSignup && <TextInput style={[styles.input, focusedInput === 'name' && styles.inputFocused]} placeholder="Name" onFocus={() => setFocusedInput('name')} onBlur={() => setFocusedInput("")} />}
      <TextInput style={[styles.input, focusedInput === 'email' && styles.inputFocused]} placeholder="Email" onChangeText={setEmail} value={email} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput("")} />
      <TextInput style={[styles.input, focusedInput === 'password' && styles.inputFocused]} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput("")} />
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
          asdfghjkl
          {/* {isSignup ? (
            <>
              <Text>Already have an account?{' '}</Text>
              <Text style={styles.linkText}>Login</Text>
            </>
          ) : (
            <>
              <Text>Don't have an account?{' '}</Text>
              <Text style={styles.linkText}>Sign up</Text>
            </>
          )} */}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;