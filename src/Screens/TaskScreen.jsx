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
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EditIcon from 'react-native-vector-icons/AntDesign';

const TaskScreen = () => {
  const [todoText, setTodoText] = useState('');
  const [arrayData, setArrayData] = useState([]);
  const [editItem, setEditItem] = useState(false);
  const [updateItem, setUpdateItem] = useState('');

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

  const handleDelete = async item => {
    await firestore()
      .collection('activities')
      .doc(docId)
      .update({
        task: firestore.FieldValue.arrayRemove(item),
      });

    await fetchData();
  };

  const handleEdit = async item => {
    setEditItem(true);
    const currentValue = item;
    setTodoText(currentValue);
    setUpdateItem(currentValue);
    console.warn('currentValue', currentValue);
  };

  const handleUpdate = async item => {
    //console.warn('task to update', updateItem);

    const snapshot = await firestore()
      .collection('activities')
      .doc(docId)
      .get();

    if (!snapshot.exists) {
      return;
    }

    const tasks = snapshot.data().task;
    const index = tasks.indexOf(updateItem);
    console.warn('index', index);
    const updatedTasks = [...tasks];
    updatedTasks[index] = todoText;

    await firestore().collection('activities').doc(docId).update({
      task: updatedTasks,
    });

    await fetchData();
    setTodoText('');
    setEditItem(false);
  };

  const renderListItem = ({item}) => {
    return (
      <View>
        <Text>{item}</Text>
        <DeleteIcon
          name="delete"
          size={20}
          color="red"
          onPress={() => handleDelete(item)}
        />
        <EditIcon
          name="edit"
          size={20}
          color="blue"
          onPress={() => handleEdit(item)}
        />
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
        <Button
          title={editItem ? 'Update' : 'Add TODO'}
          onPress={editItem ? handleUpdate : handleAddTodo}
        />
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
