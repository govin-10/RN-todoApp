import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
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
  const [loading, setLoading] = useState(false);
  const docId = auth().currentUser.uid;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
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
          }
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    {
      loading ? <ActivityIndicator size="large" color="#0000ff" /> : null;
    }
    await firestore()
      .collection('activities')
      .doc(docId)
      .update({
        task: firestore.FieldValue.arrayRemove(item),
      });
    setLoading(false);
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
            color={'#192655'}
            onPress={() => handleEdit(item)}
          />
          <DeleteIcon
            name="delete"
            size={25}
            color="black"
            onPress={() => handleDelete(item)}
          />
        </View>
      </View>
    );
  };

  return (
    <View>
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

      <View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : arrayData.length === 0 ? (
          <View style={styles.emptyMessageBox}>
            <Text style={styles.emptyMessageTitle}>Empty Task?</Text>
            <Text style={styles.emptyMessage}>
              No worries, just Add a new task above and you're good to go!!
            </Text>
          </View>
        ) : (
          <View>
            <FlatList
              nestedScrollEnabled={true}
              data={arrayData}
              renderItem={renderListItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.flatLists}
            />
          </View>
        )}
      </View>
    </View>
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
    backgroundColor: '#176B87', // Customize the color as needed
    padding: 15,
    borderRadius: 10,
  },
  taskItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    borderRadius: 10,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  taskName: {
    fontSize: 20,
    padding: 10,
  },
  iconBox: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    padding: 10,
  },
  flatLists: {
    backgroundColor: '#C9D7DD',
  },
  emptyMessageBox: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyMessageTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
