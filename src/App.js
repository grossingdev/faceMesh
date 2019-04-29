import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import ARScene, { exportIntoFile } from './ARScene';
import SaveModal from './SaveModal';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    }
  }
  _handlePress(flagLive) {
    this.setState({ showModal: true });
  }
  _handleClose = () => {
    this.setState({ showModal: false });
  };
  _handleUpload = (text) => {
    exportIntoFile();
    // this._handleClose();
  }
  renderModal() {
    if (this.state.showModal) {
      return (
        <SaveModal onClose={this._handleClose} onUpload={this._handleUpload} />
      );
    }
    return null;
  }
  render() {
    return (
      <View style={styles.container}>
        <ARScene
          style={styles.arContainer}
          debugEnabled
          showCamera={true}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonLeft} onPress={() => this._handlePress(false)}>
            <Text>
              Capture Base
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRight} onPress={() => this._handlePress(true)}>
            <Text>
              Capture Live
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderModal()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  arContainer: {
    flex: 1,
    width: 400
  },
  buttonContainer: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#AAA',
    paddingHorizontal: 30
  },
  buttonLeft: {
    flex: 1,
    height: 60,
    marginRight: 15,
    justifyContent: 'center',
    backgroundColor: '#EEE',
    alignItems: 'center',
  },
  buttonRight: {
    flex: 1,
    height: 60,
    marginLeft: 15,
    justifyContent: 'center',
    backgroundColor: '#EEE',
    alignItems: 'center',
  },

});
