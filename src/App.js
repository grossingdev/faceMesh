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
  async uploadTextureToS3(path, fileName) {
    this.setState({ waitingDialog: 'uploadingTexture', progress: 0 });
    return new Promise((resolve, reject) => {
      uploadFile(path, fileName, 'png')
        .progress((e) => {
          const progress = (e.loaded / e.total * 100.0).toFixed(0);
          this.setState({ progress });
        })
        .then(response => {
          if (response.status !== 201) {
            alert('Failed uploading');
            reject();
          } else {
            this.setState({ waitingDialog: '' });
            resolve();
          }
        });
    })
  }
  uploadSTLFileToS3(path, fileName) {
    this.setState({ waitingDialog: 'uploadingSTL', progress: 0 });
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
  async uploadFiles(stlPath, stlFileName, texturePath, textureFileName) {
    await this.uploadTextureToS3(texturePath, textureFileName);
    this.uploadSTLFileToS3(stlPath, stlFileName)
  }
  _handleUpload = (_fileName) => {
    exportIntoFile(async (path, texturePath) => {
      this._handleClose();
      this.setState({ waitingDialog: 'checking' });
      console.log('callback', path);
      const fileName = `${_fileName}.stl`;
      const textureFileName = `${_fileName}.png`;
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
            {text: 'Yes', onPress: () => this.uploadFiles(path, fileName, texturePath, textureFileName)},
          ],
          {cancelable: false},
        );
      } else {
        return this.uploadFiles(path, _fileName, texturePath, textureFileName);
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
