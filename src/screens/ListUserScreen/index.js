import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput } from 'react-native'
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage'

function ListUserScreen({ navigation }) {

  const [listUser, setListUser] = useState([]);
  const [user, setUser] = useState({})
  const [keySearch, setKeySearch] = useState('');


  useEffect(() => {
    AsyncStorage.getItem('@user').then(res => {
      setUser(JSON.parse(res))
    }).catch(err => {
      console.log(err);
    }
    )
    const onChildAdd = database().ref('/users').on("value", snapshot => {
      if (snapshot.val() !== undefined && snapshot.val() !== null) {
        const result = Object.keys(snapshot.val()).map((key) => {
          return { key, ...snapshot.val()[key] }
        })
        setListUser([...result])
      }
    });
    return () => {
      database()
        .ref(`/users`)
        .off('value', onChildAdd)
    }

  }, []);

  const onHandlePress = (item) => {
    navigation.navigate('Chat', { user: user, item: item })
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => onHandlePress(item)}>
      <View style={{ display: 'flex', flex: 1, }}>
        <View style={styles.itemLeft}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />
        </View>
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.txtName}>{item.nickName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (

    <View style={styles.container}>
      <TextInput
        style={{padding:5, paddingLeft:10,  fontSize:20, height: 40, marginHorizontal:10, borderRadius:8, backgroundColor: "#EFEFEF", marginVertical:10}}
        onChangeText={text => setKeySearch(text)}
        value={keySearch}
        placeholder='Search'
        
      />
      <FlatList
        data={listUser}
        renderItem={renderItem}
        keyExtractor={item => item.key.toString()}
      />
    </View>
  );
}

export default ListUserScreen;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#ffffff'

  },
  item: {

    height: 100,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
    padding: 10,

  },
  itemLeft: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    overflow: "hidden"

  },
  itemRight: {
    display: 'flex',
    flex: 5,
    marginLeft: 30,
  },
  txtName: {
    fontSize: 20,
    fontWeight: "bold",
    color: '#040404'
  },
  tinyLogo: {
    backgroundColor: 'red',
    display: 'flex',
    flex: 1
  }
})