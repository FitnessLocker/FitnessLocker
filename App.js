import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDECORhV3VGegw7uXKT1cRQyDHi2HXbvHk",
  authDomain: "fitness-locker.firebaseapp.com",
  projectId: "fitness-locker",
  storageBucket: "fitness-locker.appspot.com",
  messagingSenderId: "467579359412",
  appId: "1:467579359412:web:f0f1846ba3cd178450c7e1",
  measurementId: "G-1W5J03MH14"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

GoogleSignin.configure({
  webClientId: '467579359412',
});

async function signInWithGoogle() {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
  } catch (error) {
    if (error.code === 'SIGN_IN_CANCELLED') {
      console.log('User cancelled the sign-in');
    } else if (error.code === 'IN_PROGRESS') {
      console.log('Sign in is in progress');
    } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      console.log('Play services are not available');
    } else {
      console.error('Some other error happened:', error);
    }    
  }
}

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in:', result.user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleRegister = async () => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered user:', result.user);
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User is signed in:', user);
      } else {
        console.log('No user is signed in');
      }
    });

    // Clean up the listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FitnessLocker</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <GoogleSigninButton
        style={styles.googleSignInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 12,
    height: 40,
  },
  loginButton: {
    backgroundColor: '#4285f4',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#34a853',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  registerButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  googleSignInButton: {
    width: '80%',
    height: 48,
    marginTop: 12,
  },
});
