import React, { useState, Children } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal, Dimensions } from 'react-native';

function ModalCustom(props) {


  const { modalVisible, children, setModalVisible } = props;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false)
      }}>
      <View style={styles.centeredView}>
        <TouchableOpacity style={{ backgroundColor: '#e7eaed', flex: 0.6 / 10, justifyContent: "center", borderBottomWidth: 1, borderBottomColor: 'gray' }} onPress={() => { setModalVisible(!modalVisible) }} >
          <Text style={{ color: '#000', fontWeight: 'bold', marginLeft: 15 }}>Close</Text>
        </TouchableOpacity>
        <View style={styles.modalView}>
          {children}
        </View>


      </View>
    </Modal>
  );
}

export default ModalCustom;

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    backgroundColor: '#fff'

  },
  modalView: {

    flex: 10 / 10,
    justifyContent: "center",
    alignItems: 'center',

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  }

});