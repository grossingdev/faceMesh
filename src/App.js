import React, {Component} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Share, Clipboard } from 'react-native';
import ARScene, { exportIntoFile, disableFaceAnchorUpdate } from './ARScene';
import { uploadFile, checkFile, abortUpload } from './utils';
import SaveModal from './SaveModal';
import WaitingModal from './WaitingModal';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      waitingDialog: '',
    }
  }
  _handlePress(flagLive) {
    disableFaceAnchorUpdate(flagLive);
    this.setState({ showModal: true });
  }
  _handleClose = () => {
    disableFaceAnchorUpdate(false);
    this.setState({ showModal: false });
  };
  _handleAbort = () => {
    abortUpload();
    this.setState({ waitingDialog: '', progress: 0 });
  };
  uploadFileToS3(path, fileName) {
    this.setState({ waitingDialog: 'uploading', progress: 0 });
    uploadFile(path, `${fileName}.stl`)
      .progress((e) => {
        const progress = (e.loaded / e.total * 100.0).toFixed(0);
        this.setState({ progress });
      })
      .then(response => {
        if (response.status !== 201) {
          alert('Failed uploading')
        } else {
          this.setState({ waitingDialog: '' });
          setTimeout(() => {
            Alert.alert(
              'Info',
              'File has been uploaded into S3 ',
              [
                {
                  text: 'Copy Path',
                  onPress: () => Clipboard.setString(response.body.postResponse.location),
                  style: 'cancel',
                },
                {text: 'Share', onPress: () => Share.share({ message: response.body.postResponse.location})},
              ],
              {cancelable: false},
            );
          }, 500);
        }
      });
  }
  _handleUpload = (_fileName) => {
    exportIntoFile(async (path) => {
      this._handleClose();
      this.setState({ waitingDialog: 'checking' });
      console.log('callback', path);
      const fileName = `${_fileName}.stl`;
      const flagExist = await checkFile(fileName);
      if (flagExist) {
        Alert.alert(
          'Are you sure',
          'A file with the same name already exists, are you sure you want to replace it?',
          [
            {
              text: 'Cancel',
              onPress: () => this.setState({ showModal: true }),
              style: 'cancel',
            },
            {text: 'Yes', onPress: () => this.uploadFileToS3(path, _fileName)},
          ],
          {cancelable: false},
        );
      } else {
        this.uploadFileToS3(path, _fileName);
      }
    });
  };
  renderModal() {
    if (this.state.showModal) {
      return (
        <SaveModal onClose={this._handleClose} onUpload={this._handleUpload} />
      );
    }
    if (this.state.waitingDialog !== '') {
      return (
        <WaitingModal type={this.state.waitingDialog} onClose={this._handleAbort} progress={this.state.progress} />
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
          <TouchableOpacity style={styles.buttonLeft} onPress={() => this._handlePress(true)}>
            <Text>
              Capture Base
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonRight} onPress={() => this._handlePress(false)}>
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
