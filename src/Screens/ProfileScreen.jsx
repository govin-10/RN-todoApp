import {
  View,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ProfileIcon from 'react-native-vector-icons/FontAwesome5';
import DetailIcon from 'react-native-vector-icons/Octicons';

const TaskScreen = () => {
  const [userData, setUserData] = useState(null);
  const userId = auth().currentUser.uid;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const users = firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then(documentSnapshot => {
        console.log('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          console.log('User data: ', documentSnapshot.data());
          const userDatas = documentSnapshot.data();
          setUserData(userDatas);
        }
      });
  };

  const showProfile = () => {
    Alert.alert('Profile', `Name: ${userData.name}\nEmail: ${userData.email}`, [
      {
        text: 'OK',
        onPress: () => console.log('OK Pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  return (
    <View style={styles.profileContainer}>
      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          color: 'black',
          marginBottom: 20,
        }}>
        Profile
      </Text>
      {/* <Text>{auth().currentUser.email}</Text> */}

      <View style={styles.profileSection}>
        <View style={styles.profileInfo}>
          <ProfileIcon name="user" size={25} color={'black'} />
          {userData ? (
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {userData.name}
            </Text>
          ) : (
            <ActivityIndicator size="small" color="#0000ff" />
          )}
        </View>
        <DetailIcon
          name="info"
          size={25}
          color={'#606C5D'}
          onPress={() => showProfile()}
        />
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        }}>
        <Text
          style={{
            color: 'white',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
          LogOut
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  logoutButton: {
    backgroundColor: '#146C94', // Customize the color as needed
    padding: 15,
    borderRadius: 10,
    width: '100%',
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 25,
    backgroundColor: '#C9D7DD',
    padding: 20,
  },
  profileInfo: {
    flexDirection: 'row',
    gap: 10,
  },
});
