import React, { Component } from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    backgroundColor: '#AAA',
    flexDirection: 'column',
    width: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
  },
  title: {
    paddingVertical: 15,
    fontSize: 19
  },
  btnDefault: {
    marginVertical: 15,
    height: 40,
    width: 250,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default class SaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }
  render() {
    const { type, progress } = this.props;
    console.log('type', type);
    let title = 'Check file existing status...';
    if (type === 'uploadingSTL') {
      title = `Upload STL file into S3 storage - ${progress} %`;
    } else if (type === 'uploadingTexture') {
      title = `Upload Texture file into S3 storage - ${progress} %`;
    }
    return (
      <Modal transparent>
        <View style={styles.container}>
          <View style={styles.modal}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={styles.title}>
              {title}
            </Text>
            {type !== 'checking' &&
            <TouchableOpacity style={styles.btnDefault} onPress={this.props.onClose}>
              <Text style={styles.label}>Abort</Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      </Modal>
    )
  }
}