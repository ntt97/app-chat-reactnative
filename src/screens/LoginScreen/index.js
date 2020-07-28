import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage'
function LoginScreen({ navigation }) {
  const [name, setName] = useState("")
  const _onChangeName = (text) => {
    setName(text);
  }
  const _toChatRoom = async () => {

    const user = {
      about: 'beautiful',
      nickName: name,
      photoUrl: '....'
    }
    let result = null;

    try {
      await database().ref('/users').orderByChild("nickName").equalTo(name).once('value', function (snapshot) {
        if (snapshot.val() !== undefined && snapshot.val() !== null) {
          result = Object.keys(snapshot.val()).map((key) => {
            return { key, ...snapshot.val()[key] }
          })
        }
      })

      if (result) {

        await AsyncStorage.setItem('@user', JSON.stringify(result[0]))
      } else {
        const tmp = database().ref('/users').push(user);
        await AsyncStorage.setItem('@user', JSON.stringify({ ...user, key: tmp.key }))
      }

    } catch (error) {
      console.log('===========================================')
      console.log(error);
      console.log('===========================================')
    }
    navigation.navigate('Main')
  }
  return (
    <View style={{ flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', padding: 10, paddingBottom: 15 }} >
      <Text>
        ENTER YOUR NAME :
     </Text>
      <TextInput placeholder="" style={{
        borderColor: "#A5A5A5",
        borderWidth: 0.5, padding: 8, width: '100%', marginBottom: 15, marginTop: 15
      }}
        onChangeText={(text) => _onChangeName(text)}
      />
      <TouchableOpacity onPress={() => _toChatRoom()} >
        <Text style={{ fontWeight: 'bold' }} >
          Join Now
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default LoginScreen;