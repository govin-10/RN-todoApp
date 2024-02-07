// Import necessary components and styles
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  // State for email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle login
  const handleSignUp = ({navigation}) => {
    // Implement your login logic here
    navigation.navigate('SignUp');
  };

  const handleSignIn = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User signed in!');
      });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        style={styles.inputBox}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        leftIcon={{type: 'font-awesome', name: 'lock'}}
        secureTextEntry
        onChangeText={text => setPassword(text)}
        value={password}
        style={styles.inputBox}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleSignIn}>
        <Text
          style={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          Login
        </Text>
      </TouchableOpacity>

      {/* Additional links or text (e.g., Forgot Password?) */}
      <TouchableOpacity style={{padding: 10, marginTop: 50}}>
        <Text
          style={styles.signUp}
          onPress={() => {
            handleSignUp({navigation});
          }}>
          New to ToDo?? Signup here!!
        </Text>
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
  loginButton: {
    backgroundColor: '#007bff', // Customize the color as needed
    padding: 15,
    borderRadius: 10,
  },
  signUp: {
    textAlign: 'center',
    color: '#007bff', // Customize the color as needed
  },
  inputBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 10,
    marginBottom: 10,
  },
});

export default Login;
