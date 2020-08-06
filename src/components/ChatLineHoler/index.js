import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';

import Modal from '../Modal';
//define value for image
let imageHeight = 0;
let children = null;

export const ChatLineHolder = (props) => {
  const {item, currentPeerUser, style} = props;
  const [modalVisible, setModalVisible] = useState(false);

  const onShowImage = async (url) => {
    try {
      //get width and height image
      await Image.getSize(url, (widthImg, heightImg) => {
        const screenWidth = Dimensions.get('window').width;
        const scaleFactor = widthImg / screenWidth;
        imageHeight = heightImg / scaleFactor;
        // render Image detail
        children = (
          <Image
            style={{width: Dimensions.get('window').width, height: imageHeight}}
            source={{uri: url}}
          />
        );
        // show modal
        setModalVisible(true);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Modal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        children={children}
      />
      {currentPeerUser ? (
        <View style={styles.itemLeft}>
          <Image
            style={styles.tinyLogo}
            source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
          />
        </View>
      ) : (
        <View></View>
      )}
      {item?.type !== 2 ? (
        <View
          style={[
            styles.content,
            style,
            {
              marginLeft: !currentPeerUser ? 5 : 40,
              backgroundColor: currentPeerUser ? '#F1F1F1' : '#005ce6',
            },
          ]}>
          <Text
            style={{color: currentPeerUser ? '#000' : '#ffffff', fontSize: 18}}>
            {item.content}
          </Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => onShowImage(item.content)}>
          <Image
            style={{width: '70%', aspectRatio: 2, marginBottom: 10}}
            source={{uri: item.content}}
          />
        </TouchableOpacity>
      )}

      <Text style={{position: 'absolute', bottom: -5, right: 10, fontSize: 10}}>
        {moment(Number(item.time)).format('ll')}
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  itemLeft: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: 10,
    marginLeft: 10,
    position: 'absolute',
    top: 0,
    left: -2,
  },

  tinyLogo: {
    backgroundColor: 'red',
    display: 'flex',
    flex: 1,
  },
  content: {
    flexDirection: 'column',
    width: '50%',
    alignItems: 'flex-start',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 10,
    marginRight: 5,
  },
});
