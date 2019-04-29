import React, { Component } from 'react';
import {Modal, View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import moment from 'moment';

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
    justifyContent: 'center'
  },
  title: {
    paddingVertical: 15,
    fontSize: 19
  },
  textInput: {
    height: 50,
    paddingLeft: 15,
    backgroundColor: '#FFF',
    borderWidth: 1,
    width: 250,
  },
  btnDefault: {
    marginVertical: 15,
    height: 40,
    width: 250,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    width: 250,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    textAlign: 'center',
    fontSize: 16,
  },
  buttonLeft: {
    flex: 1,
    height: 40,
    marginRight: 10,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonRight: {
    flex: 1,
    height: 40,
    marginLeft: 10,
    backgroundColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default class SaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ''
    }
  }
  _handleUpload = () => {
    this.props.onUpload(this.state.text);
  };
  _handleDefault = () => {
    const str = moment().format('YYYY_MM_DD_hh_mm_ss');
    this.setState({ text: str });
  }
  render() {
    return (
      <Modal transparent>
        <View style={styles.container}>
          <View style={styles.modal}>
            <Text style={styles.title}>Mesh upload name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
              placeholder="filename here..."
              clearButtonMode="always"
            />
            <TouchableOpacity style={styles.btnDefault} onPress={this._handleDefault}>
              <Text style={styles.label}>default name</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.buttonLeft} onPress={this.props.onClose}>
                <Text style={styles.label}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonRight} onPress={this._handleUpload}>
                <Text style={styles.label}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}