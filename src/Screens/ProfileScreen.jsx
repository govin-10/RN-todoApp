import {View, Text, Button} from 'react-native';
import React, {useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TaskScreen = () => {
  const userId = auth().currentUser.uid;
  useEffect(() => {
    const fetchUserData = async () => {
      const users = firestore()
        .collection('users')
        .doc(userId)
        .get()
        .then(documentSnapshot => {
          console.log('User exists: ', documentSnapshot.exists);
          if (documentSnapshot.exists) {
            console.log('User data: ', documentSnapshot.data());
          }
        });
    };

    fetchUserData();
  }, []);
  return (
    <View>
      <Text>HomeScreen</Text>
      <Text>{auth().currentUser.email}</Text>
      <Button
        title="Logout"
        onPress={() => {
          auth()
            .signOut()
            .then(() => console.log('User signed out!'));
        }}
      />
    </View>
  );
};

export default TaskScreen;
