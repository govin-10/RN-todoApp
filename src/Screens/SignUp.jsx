// Import necessary components and styles
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Signup = ({navigation}) => {
  // State for name, email, and password
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle signup
  const handleSignup = async () => {
    try {
      const isUserCreated = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      const userData = {
        id: isUserCreated.user.uid,
        email: email,
        name: name,
      };

      await firestore()
        .collection('users')
        .doc(isUserCreated.user.uid)
        .set(userData)
        .then(() => {
          console.log('User created successfully!');
        });

      await firestore()
        .collection('activities')
        .doc(isUserCreated.user.uid)
        .set({
          task: [],
        });
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create an account</Text>

      {/* Name TextInput */}
      <TextInput
        placeholder="Full Name"
        onChangeText={text => setName(text)}
        value={name}
        style={styles.inputBox}
      />

      {/* Email TextTextInput */}
      <TextInput
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        style={styles.inputBox}
      />

      {/* Password TextInput */}
      <TextInput
        placeholder="Password"
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
        style={styles.inputBox}
      />

      {/* Signup Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text
          style={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          SIGN UP
        </Text>
      </TouchableOpacity>

      {/* Additional links or text (e.g., Already have an account?) */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.haveAccount}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 10,
    marginBottom: 10,
  },
  signupButton: {
    backgroundColor: '#007bff', // Customize the color as needed
    padding: 15,
    borderRadius: 10,
  },
  haveAccount: {
    textAlign: 'center',
    marginTop: 10,
    color: '#007bff', // Customize the color as needed
  },
});

export default Signup;
