import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, AppState} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import {fcmService} from '../../functions/FCMService';
import {localNotificationService} from '../../functions/LocalNotificationService';

import ListUserScreen from '../ListUserScreen';
import GroupScreen from '../GroupScreen';

function Main({navigation}) {
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    
    requestUserPermission();
    fcmService.registerAppWithFCM();
    fcmService.register(onRegister, onNotification, onOpenNotification);
    localNotificationService.configure(onOpenNotification);

    async function onRegister(token) {
      console.log('[App] onRegister: ', token);
      const user = await AsyncStorage.getItem('@user');
      const {key} = JSON.parse(user);

      firestore()
        .collection('users')
        .doc(key)
        .update({
          id: key,
          pushToken: token,
          isOnline:1
        })
        .then(() => {
          console.log('User updated!');
        });
    }

    function onNotification(notify) {
      console.log('[App] onNotification: ', notify);
      const options = {
        soundName: 'default',
        playSound: true, //,
        // largeIcon: 'ic_launcher', // add icon large for Android (Link: app/src/main/mipmap)
        // smallIcon: 'ic_launcher' // add icon small for Android (Link: app/src/main/mipmap)
      };
      localNotificationService.showNotification(
        0,
        notify.title,
        notify.body,
        notify,
        options,
      );
    }

    function onOpenNotification(notify) {
      console.log('[App] onOpenNotification: ', notify);
      alert('Open Notification: ' + notify.body);
    }
    AppState.addEventListener('change', handleAppStateChange);
    return () => {
      console.log('[App] unRegister');
      fcmService.unRegister();
      localNotificationService.unregister();
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleAppStateChange = async (params) => {
   
    if (params === 'background') {
      const user = await AsyncStorage.getItem('@user');
      const {key} = JSON.parse(user);

      firestore()
        .collection('users')
        .doc(key)
        .update({
          chattingWith:''
        })
        .then(() => {
          console.log('User updated!');
        });
    
      }
  };

  const [isGroup, setIsGroup] = useState(false);
  const changeContent = (props) => {
    if (props === 'list') {
      setIsGroup(false);
    } else {
      setIsGroup(true);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => changeContent('list')}
          style={[styles.headerLeft, {borderBottomWidth: !isGroup ? 4 : 0}]}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>List user</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => changeContent('group')}
          style={[styles.headerRight, {borderBottomWidth: isGroup ? 4 : 0}]}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Chat Group</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.contents}>
        {!isGroup ? (
          <ListUserScreen navigation={navigation} />
        ) : (
          <GroupScreen navigation={navigation} />
        )}
      </View>
    </View>
  );
}

export default Main;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eaeaea',
  },
  header: {
    padding: 1,
    height: 50,
    display: 'flex',
    flexDirection: 'row',
  },
  headerLeft: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 4,
  },
  headerRight: {
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contents: {
    display: 'flex',
    flex: 1,
  },
});
