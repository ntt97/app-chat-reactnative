import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, Image, TouchableOpacity, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
let subscriber = null;
import * as APP_STRING from '../../../../const';
let groupChatId = '';

const Item = (props) => {
  const [lastMsg, setLastMsg] = useState({});
  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const getLastMessage = async (id) => {
    const user = await AsyncStorage.getItem(APP_STRING.NODE_USER_LOCAL);
    const keyCurrent = JSON.parse(user).key;
   
    if (hashString(keyCurrent) <= hashString(id)) {
      groupChatId = `${keyCurrent}-${id}`;
    } else {
      groupChatId = `${id}-${keyCurrent}`;
    }

    subscriber = firestore()
      .collection(APP_STRING.NODE_MSG)
      .doc(groupChatId)
      .collection(groupChatId)
      .orderBy('time', 'asc')
      .limitToLast(1)
      .onSnapshot((documentSnapshot) => {
        documentSnapshot.docChanges().forEach((change) => {
          setLastMsg(change.doc.data());
        });
      });
  };
  useEffect(() => {
    getLastMessage(props.item.key);
    return () =>{
      console.log('===========================================')
      console.log('da thoat user');
      console.log('===========================================')
      subscriber();
    }
  }, []);


  return (
    <TouchableOpacity
      style={[styles.item,{backgroundColor:(lastMsg?.isSeen===0&&props?.item?.key===lastMsg.idSend)?'red':'white' }]}
      onPress={() => props.onHandlePress(props.item,lastMsg)}>
      <View style={{display: 'flex', flex: 1}}>
        <View style={styles.itemLeft}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://reactnative.dev/img/tiny_logo.png',
            }}
          />
        </View>
        {props?.item?.isOnline?(<View style={styles.active}></View>):(null)}
      </View>
      <View style={styles.itemRight}>
        <Text style={styles.txtName}>{props.item.nickName}</Text>
        {lastMsg.content ? (
          <Text numberOfLines={1}>{lastMsg.content}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

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
    // marginLeft: 10,
  },
  itemLeft: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    overflow: 'hidden',
    marginLeft:10
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
  active: {
    borderColor:'#ffffff',
    borderWidth:3,
    width:20,
    height:20,
    borderRadius:10,
    backgroundColor:'green',
    position:"absolute",
    right:0,
    bottom:0}

});

export default Item;
