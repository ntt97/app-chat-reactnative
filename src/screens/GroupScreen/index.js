import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TouchableHighlight, TextInput,FlatList } from 'react-native';
import database from '@react-native-firebase/database';

function GroupScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [listGroup, setListGroup] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {

    const onChildAdd = database().ref('/chatRoom').on("value", snapshot => {
      if (snapshot.val() !== undefined && snapshot.val() !== null) {
        const result = Object.keys(snapshot.val()).map((key) => {
          return { key, ...snapshot.val()[key] }
        })
       
        setListGroup([...result])
      }
    });
    return () => {
      database()
        .ref(`/chatRoom`)
        .off('value', onChildAdd)
    }

  }, []);

  const _onChangeName = (text) => {
    setName(text);
  }

  const onCreate = () => {
    setModalVisible(true)
  }
  const _goToGroup = () => {

    if (name.trim().length < 1) {
      return;
    }
   database().ref('/chatRoom').push({name:name});
   setModalVisible(false)

  }

  const goToGroupChat = (item)=>{
    navigation.navigate('ChatRoom',{item})
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => goToGroupChat(item)}>
      <View style={{ display: 'flex', flex: 1, }}>
        <View style={styles.itemLeft}></View>
      </View>
      <View style={styles.itemRight}>
        <Text style={{ fontSize: 20 }}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container} >
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
        }}
      >
        <View style={styles.centeredView}>
          <Text style={{ alignSelf: "center", fontSize: 25, fontWeight: "bold" }}>Create Group</Text>
          <TouchableHighlight

            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <Text>Cancel</Text>
          </TouchableHighlight>

          <View>
            <TextInput placeholder="" style={{
              borderColor: "#A5A5A5",
              borderWidth: 0.5, padding: 8, width: '100%', marginBottom: 15, marginTop: 15
            }}
              onChangeText={(text) => _onChangeName(text)}
            />
            <TouchableOpacity onPress={() => _goToGroup()} >
              <Text style={{ fontWeight: 'bold' }} >
                Create
             </Text>
            </TouchableOpacity>
          </View>

        </View>

      </Modal>
      <TouchableOpacity onPress={onCreate} style={styles.item}>
        <View style={{ display: 'flex', flex: 1, }}>
          <View style={[styles.itemLeft, { backgroundColor: 'gray' }]}>
            <Text style={{ fontSize: 30, fontWeight: "bold" }}>+</Text>
          </View>
        </View>
        <View style={styles.itemRight}>
          <Text style={{ fontSize: 20 }}>Create group</Text>
        </View>
      </TouchableOpacity>     

      <View style={{marginTop:30,width:"100%",height:'100%'}}>
      <FlatList
        data={listGroup}
        renderItem={renderItem}
        keyExtractor={item => item.key.toString()}
      />
   
      
      </View>
    </View>
  );
}

export default GroupScreen;
const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 15,

  },
  item: {
    backgroundColor: "#fff",
    height: 80,
    display: 'flex',   
    flexDirection: 'row',
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1
    
  },
  itemLeft: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    backgroundColor: '#fff',
    justifyContent: "center",
    alignItems: 'center'
  },
  itemRight: {
    display: 'flex',
    flex: 5,
    marginLeft: 20,
  },

  centeredView: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    padding: 10



  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
})