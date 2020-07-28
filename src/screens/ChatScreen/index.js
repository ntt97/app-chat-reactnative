import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, FlatList, TextInput } from 'react-native'
import database from '@react-native-firebase/database';
import { ChatLineHolder } from '../../components/ChatLineHoler';
import moment from 'moment'
let currentPeerUser = null;
let currentUser = null;
let groupChatId = null;
let removeListener = null;

function ChatScreen({ navigation, route }) {
  const [chatData, setChatData] = useState([]);
  const [chatInputContent, setChatInputContent] = useState('');



  const hashString = str => {

    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash += Math.pow(str.charCodeAt(i) * 31, str.length - i)
      hash = hash & hash // Convert to 32bit integer
    }
    return hash
  }

  const onHandleChange = (text) => {
    setChatInputContent(text)
  }

  const getListHistory = () => {

    if (hashString(currentUser.key) <= hashString(currentPeerUser.key)) {
      groupChatId = `${currentUser.key}-${currentPeerUser.key}`
    } else {
      groupChatId = `${currentPeerUser.key}-${currentUser.key}`
    }
    removeListener = database().ref(`/messages/${groupChatId}`).on("value", snapshot => {
      if (snapshot.val() !== undefined && snapshot.val() !== null) {

        setChatData(Object.values(snapshot.val()))
      }
    });

  }
  useEffect(() => {
    if (route.params?.user && route.params?.item) {
      currentPeerUser = route.params?.item;
      currentUser = route.params?.user;
      getListHistory();
      navigation.setOptions({ title: currentPeerUser.nickName })
    }



    return () => {
      database()
        .ref(`/messages/${groupChatId}`)
        .off('value', removeListener)
      setChatData([]);

    }

  }, [route.params?.item?.key]);
  const _sendMessage = () => {

    if (chatInputContent.trim() === '') {
      return;
    }
    const timestamp = moment()
      .valueOf()
      .toString()
    const itemMessage = {
      idSend: currentUser.key,
      idTo: currentPeerUser.key,
      time: timestamp,
      content: chatInputContent.trim(),
    }

    database().ref(`/messages/${groupChatId}/${timestamp}`).set(itemMessage);
    setChatInputContent('');
  }

  const _renderChatLine = (item) => {
    if (item.idSend === currentUser.key) {
      return (
        <View style={{ alignItems: 'flex-end' }} >
          <ChatLineHolder item={item} />
        </View>
      );
    }
    return (
      <View style={{ alignItems: 'flex-start' }} >
       <ChatLineHolder   currentPeerUser={currentPeerUser} item={item} />
      </View>
    );
  };
  return (
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-end' }} >
      <ImageBackground imageStyle={{ opacity: 0.4 }} source={require('../../img/backGround.png')}
        style={{ flex: 9 / 10, backgroundColor: '#A5A5A5', flexDirection: 'column', justifyContent: 'flex-end' }} >
        <FlatList
          data={chatData}
          keyExtractor={(item, index) => item.time.toString()}
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

export default ChatScreen;