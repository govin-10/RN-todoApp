import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import DeleteIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import EditIcon from 'react-native-vector-icons/AntDesign';
import CheckIcon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native-gesture-handler';
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
        //console.warn('User exists: ', documentSnapshot.exists);
        if (documentSnapshot.exists) {
          //console.warn('User data: ', documentSnapshot.data());
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
  };

  const handleUpdate = async item => {
    const snapshot = await firestore()
      .collection('activities')
      .doc(docId)
      .get();

    if (!snapshot.exists) {
      return;
    }

    const tasks = snapshot.data().task;
    const index = tasks.indexOf(updateItem);

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
      <View style={styles.taskItems}>
        <Text style={styles.taskName}>{item}</Text>
        <View style={styles.iconBox}>
          <EditIcon
            name="edit"
            size={25}
            color={'black'}
            onPress={() => handleEdit(item)}
          />
          <DeleteIcon
            name="delete"
            size={25}
            color="red"
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            style={styles.inputBox}
            placeholder="Enter your todo task"
            value={todoText}
            onChangeText={text => setTodoText(text)}
          />
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={editItem ? handleUpdate : handleAddTodo}>
            <Text
              style={{
                color: 'white',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              {editItem ? 'Update' : 'Add TODO'}
            </Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={arrayData}
          renderItem={renderListItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  inputBox: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    padding: 10,
    marginBottom: 10,
  },
  addItemButton: {
    backgroundColor: '#007bff', // Customize the color as needed
    padding: 15,
    borderRadius: 10,
  },
  taskItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,

    marginBottom: 5,
    borderRadius: 10,
  },
  taskName: {
    fontSize: 20,
  },
  iconBox: {
    flexDirection: 'row',
    gap: 5,
    alignSelf: 'center',
  },
});
