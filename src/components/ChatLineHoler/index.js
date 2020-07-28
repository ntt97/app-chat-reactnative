import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import moment from 'moment'

export const ChatLineHolder = (props) => {
  const { item, currentPeerUser, style } = props;

  return (
    <View style={{}}>
      {currentPeerUser ? (<View style={styles.itemLeft}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: 'https://reactnative.dev/img/tiny_logo.png',
          }}
        />
      </View>) : (<View></View>)}
      <View style={[styles.content,
        style,
      {
        marginLeft: !currentPeerUser ? 5 : 40,
        backgroundColor: currentPeerUser ? '#F1F1F1' : '#005ce6',

      }
      ]} >
        {/* {!sender ? <View></View> : <Text style={{ color: '#005ce6', marginBottom: 5 }} >{sender}</Text>} */}

        <Text style={{ color: currentPeerUser ? '#000' : '#ffffff', fontSize: 18 }}>{item.content}</Text>
      </View>
    <Text style={{position:'absolute',bottom:-5,right:10,fontSize:10,}}>{moment(Number(item.time)).format('ll')}</Text>
    </View>

  );

}
const styles = StyleSheet.create({

  itemLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    marginTop: 10,
    marginLeft: 10,
    position: 'absolute',
    top: 0,
    left: -2

  },

  tinyLogo: {
    backgroundColor: 'red',
    display: 'flex',
    flex: 1
  },
  content: {
    flexDirection: 'column',
    width: '50%',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 5
  }

})