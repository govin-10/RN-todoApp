import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const TaskScreen = () => {
  const [todoText, setTodoText] = useState('');
  const [arrayData, setArrayData] = useState([]);

  const docId = auth().currentUser.uid;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await firestore()
      .collection('activities')
      .doc(docId)
      .get()
      .then(documentSnapshot => {
        console.warn('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          console.warn('User data: ', documentSnapshot.data());
          const taskData = documentSnapshot.data().task;
          setArrayData(taskData);
        } else {
          return [];
        }
      });
  };

  const handleAddTodo = async () => {
    await firestore()
      .collection('activities')
      .doc(docId)
      .update({
        task: firestore.FieldValue.arrayUnion(todoText),
      });

    await fetchData();
    setTodoText('');
  };

  const renderListItem = ({item}) => {
    return (
      <View>
        <Text>{item}</Text>
      </View>
    );
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter your todo task"
          value={todoText}
          onChangeText={text => setTodoText(text)}
        />
        <Button title="Add Todo" onPress={handleAddTodo} />
      </View>
      <View>
        <FlatList
          data={arrayData}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});
