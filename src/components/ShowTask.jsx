import {View, Text, FlatList} from 'react-native';
import React, {useEffect, useState} from 'react';

const ShowTask = props => {
  const {myDatas} = props.showTasks;

  return (
    <View>
      <FlatList
        data={[myDatas]}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export default ShowTask;
