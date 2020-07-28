import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'

import ListUserScreen from '../ListUserScreen'
import GroupScreen from '../GroupScreen'

function Main({ navigation }) {
  const [isGroup, setIsGroup] = useState(false)
  const changeContent = (props) => {
    if (props === "list") {
      setIsGroup(false)
    } else {
      setIsGroup(true)
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => changeContent("list")} style={[styles.headerLeft, { borderBottomWidth: !isGroup ? 4 : 0 }]} >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>List user</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeContent("group")} style={[styles.headerRight, { borderBottomWidth: isGroup ? 4 : 0 }]}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>Chat Group</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contents}>
        {!isGroup?<ListUserScreen navigation={navigation}/>:<GroupScreen navigation={navigation} />}
      </View>
    </View>
  );
}

export default Main;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaeaea"
  },
  header: {
    padding: 1,
    height: 50,
    display: 'flex',
    flexDirection: "row",
   
  },
  headerLeft: {
    display: 'flex',
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth:4,
   
  },
  headerRight: {
    display: 'flex',
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  contents: {
    display:'flex',   
    flex:1
  }

})