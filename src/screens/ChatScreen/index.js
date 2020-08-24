import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  TextInput,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {ChatLineHolder} from '../../components/ChatLineHoler';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import * as APP_STRING from '../../const/index';

import iconSend from '../../img/send@32.png';
import iconUpload from '../../img/upload@32.png';

let currentPeerUser = null;
let currentUser = null;
let groupChatId = null;
let subscriber = null;
let lastMsg =null;
function ChatScreen({navigation, route}) {
  const [chatData, setChatData] = useState([]);
  const [chatInputContent, setChatInputContent] = useState('');

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i);
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  const onHandleChange = (text) => {
    setChatInputContent(text);
  };

  const getListHistory = async () => {
    // firestore()    
    // .collection(APP_STRING.NODE_MSG)
    // .doc(groupChatId)
    // .collection(groupChatId)
    // .doc(lastMsg.time)
    // .update({isSeen:1})

    let listMessage = [];
    subscriber = firestore()    
      .collection(APP_STRING.NODE_MSG)
      .doc(groupChatId)
      .collection(groupChatId)
      .orderBy('time', 'asc')
      .limitToLast(10)      
      .onSnapshot((documentSnapshot) => {
        documentSnapshot.forEach((change) => {
          if(change.data().idTo===currentUser.key&&change.data()?.isSeen===0){
            change.ref.update({isSeen:1})
          }         
          listMessage.unshift(change.data());
          
        });
          
        setChatData(listMessage);
        listMessage = [];
      });
     
  };

  useEffect(() => {
    if (route.params?.user && route.params?.item) {      
      currentPeerUser = route.params?.item;
      currentUser = route.params?.user;
      lastMsg = route.params.lastMsg;
      if (hashString(currentUser.key) <= hashString(currentPeerUser.key)) {
        groupChatId = `${currentUser.key}-${currentPeerUser.key}`;
      } else {
        groupChatId = `${currentPeerUser.key}-${currentUser.key}`;
      }
     
      getListHistory();
      navigation.setOptions({title: currentPeerUser.nickName});
    }

    return () => {
   
      subscriber();
      firestore()
        .collection('users')
        .doc(currentUser.key)
        .update({
          chattingWith: '',
        })
        .then(() => {
          console.log('User updated!');
        });
    };
  }, [route.params?.item?.key]);

  const _sendMessage = async () => {
    if (chatInputContent.trim() === '') {
      return;
    }
    const timestamp = moment().valueOf().toString();
    const itemMessage = {
      idSend: currentUser.key,
      idTo: currentPeerUser.key,
      time: timestamp,
      content: chatInputContent.trim(),
      type: 1,
      isSeen: 0,
    };
    try {
      await firestore()
        .collection(APP_STRING.NODE_MSG)
        .doc(groupChatId)
        .collection(groupChatId)
        .doc(timestamp)
        .set(itemMessage);
    } catch (error) {
      console.log(error);
    }
    setChatInputContent('');
  };

  const _renderChatLine = (item) => {
    if (item.idSend === currentUser.key) {
      return (
        <View style={{alignItems: 'flex-end'}}>
          <ChatLineHolder item={item} />
        </View>
      );
    }
    return (
      <View style={{alignItems: 'flex-start'}}>
        <ChatLineHolder currentPeerUser={currentPeerUser} item={item} />
      </View>
    );
  };

  const openPickerImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
    })
      .then((image) => {
        uploadFile(image);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const uploadFile = async (image) => {
    const timestamp = moment().valueOf().toString();
    if (image) {
      try {
        let reference = storage().ref(`chat.images/${timestamp}`);
        await reference.putFile(image.path);
        const url = await reference.getDownloadURL();

        const itemMessage = {
          idSend: currentUser.key,
          idTo: currentPeerUser.key,
          time: timestamp,
          content: url,
          type: 2,
          isSeen: 0,
        };

        await firestore()
          .collection(APP_STRING.NODE_MSG)
          .doc(groupChatId)
          .collection(groupChatId)
          .doc(timestamp)
          .set(itemMessage);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View
      style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
      <ImageBackground
        imageStyle={{opacity: 0.4}}
        source={require('../../img/backGround.png')}
        style={{
          flex: 9 / 10,
          backgroundColor: '#A5A5A5',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <FlatList
          style={{padding: 10}}
          data={chatData}
          keyExtractor={(item) => item.time.toString()}
          renderItem={({item}) => _renderChatLine(item)}
          inverted
        />
      </ImageBackground>
      <View style={{flex: 1 / 10}}>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#FFF',
            width: '100%',
            height: '100%',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginLeft: 2,
          }}>
          <View style={{flex: 1 / 10}}>
            <TouchableOpacity onPress={openPickerImage}>
              <Image source={iconUpload} />
            </TouchableOpacity>
          </View>
          <View style={{flex: 8 / 10}}>
            <TextInput
              placeholder="Nhập nội dung chat"
              value={chatInputContent}
              onChangeText={(text) => onHandleChange(text)}
              style={{height: 100, fontSize: 18}}
            />
          </View>
          <View style={{flex: 1 / 10}}>
            <TouchableOpacity onPress={() => _sendMessage()}>
              <Image source={iconSend} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ChatScreen;
