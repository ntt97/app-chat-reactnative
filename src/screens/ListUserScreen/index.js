import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import Item from './components/Item';
import * as APP_STRING from '../../const';

function ListUserScreen({navigation}) {
  const [listUser, setListUser] = useState([]);
  const [keySearch, setKeySearch] = useState('');

  useEffect(() => {
    getListUser();
  }, []);

  const getListUser = async () => {
    let result = [];
    const data = await firestore().collection(APP_STRING.NODE_USERS).limit(10).get();
    if (data.docs.length > 0) {
      data.docs.forEach((documentSnapshot) => {
        result.push({...documentSnapshot.data(), key: documentSnapshot.id});
      });
    }

    setListUser(result);
  };
  const onHandlePress = async (item,lastMsg) => {
    const user = await AsyncStorage.getItem(APP_STRING.NODE_USER_LOCAL);
  await  firestore()
      .collection('users')
      .doc(JSON.parse(user).key)
      .update({
        chattingWith: item.key,
      })
      .then(() => {
        console.log('User updated!');
      });
      
    navigation.navigate('Chat', {user: JSON.parse(user), item: item, lastMsg:lastMsg});
  };

  // const renderItem = ({item}) => (
  //   <TouchableOpacity style={styles.item} onPress={() => onHandlePress(item)}>
  //     <View style={{display: 'flex', flex: 1}}>
  //       <View style={styles.itemLeft}>
  //         <Image
  //           style={styles.tinyLogo}
  //           source={{
  //             uri: 'https://reactnative.dev/img/tiny_logo.png',
  //           }}
  //         />
  //       </View>
  //     </View>
  //     <View style={styles.itemRight}>
  //       <Text style={styles.txtName}>{item.nickName}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <TextInput
        style={{
          padding: 5,
          paddingLeft: 10,
          fontSize: 20,
          height: 40,
          marginHorizontal: 10,
          borderRadius: 8,
          backgroundColor: '#EFEFEF',
          marginVertical: 10,
        }}
        onChangeText={(text) => setKeySearch(text)}
        value={keySearch}
        placeholder="Search"
      />
      <FlatList
        data={listUser}
        renderItem={(props) => (
          <Item onHandlePress={onHandlePress} {...props} />
        )}
        keyExtractor={(item) => item.key.toString()}
      />
    </View>
  );
}

export default ListUserScreen;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  item: {
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  itemLeft: {
    width: 60,
    height: 60,
    borderRadius: 30,
    // borderWidth: 2,
    overflow: 'hidden',
  },
  itemRight: {
    height: '100%',
    display: 'flex',
    flex: 5,
    marginLeft: 30,
    borderBottomWidth: 1,
    justifyContent: 'center',
    borderColor: 'gray',
  },
  txtName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#040404',
  },
  tinyLogo: {
    backgroundColor: 'red',
    display: 'flex',
    flex: 1,
  },
});
