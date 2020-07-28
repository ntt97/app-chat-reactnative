import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, TextInput } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import database from '@react-native-firebase/database';
import { ChatLineHolder } from '../../components/ChatLineHoler';


let currentUser = null;
let groupChat = null;
let removeListener = null;

function ChatRoomScreen({ navigation, route }) {
  const [chatData, setChatData] = useState([]);
  const [chatInputContent, setChatInputContent] = useState('');





  const onHandleChange = (text) => {
    setChatInputContent(text)
  }

  const getListHistory = () => {

    removeListener = database().ref(`/chatRoom/${groupChat.key}`).on("value", snapshot => {
      if (snapshot.val() !== undefined && snapshot.val() !== null) {

        setChatData([...Object.values(snapshot.val())])
      }

    });

  }
  useEffect(() => {
    AsyncStorage.getItem('@user').then(res => {
      currentUser = JSON.parse(res);
    }).catch(err => {
      console.log(err);
    }
    )
    if (route.params?.item) {
      groupChat = route.params.item;

      getListHistory();
    }

   
    return () => {
      database()
      .ref(`/chatRoom/${groupChat.key}`)
      .off('value', removeListener)
    setChatData([]);
    }

  }, [route.params?.item?.key]);
  const _sendMessage = () => {

    if (chatInputContent.trim() === '') {
      return;
    }
    const itemMessage = {
      idUser: currentUser.key,
      nickName: currentUser.nickName,
      time: "000",
      content: chatInputContent.trim(),
    }

    database().ref(`/chatRoom/${groupChat.key}`).push(itemMessage);
    setChatInputContent('');
  }

  const _renderChatLine = (item) => {
    if (item.idUser === currentUser.key) {
      return (
        <View style={{ alignItems: 'flex-end' }} >
          <ChatLineHolder sender="YOU" chatContent={item.content} />
        </View>
      );
    }
    return (
      <ChatLineHolder sender={item.nickName} chatContent={item.content} />
    );
  };
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} >
      <ImageBackground imageStyle={{ opacity: 0.4 }} source={require('../../img/backGround.png')}
        style={{ flex: 9 / 10, backgroundColor: '#A5A5A5', flexDirection: 'column', justifyContent: 'flex-end' }} >
        <FlatList
          data={chatData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => _renderChatLine(item)}
          inverted
        />

      </ImageBackground>
      <View style={{ flex: 1 / 10 }} >
        <View style={{
          flexDirection: 'row', backgroundColor: '#FFF',
          width: '100%', height: '100%', justifyContent: 'space-around', alignItems: 'center', marginLeft: 2
        }}  >
          <View style={{ flex: 9 / 10 }} >
            <TextInput placeholder="Nhập nội dung chat" value={chatInputContent}
              onChangeText={(text) => onHandleChange(text)} style={{ height: 100, fontSize: 18 }} />
          </View>
          <View style={{ flex: 1 / 10 }} >
            <TouchableOpacity onPress={() => _sendMessage()} >
              <Text style={{ color: '#0099ff', fontSize: 14, marginRight: 15 }} >
                Gửi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

export default ChatRoomScreen;