import { requireNativeComponent, NativeModules } from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';

const ARSceneView = requireNativeComponent('ARSceneView', ARSceneView);
const ARSceneViewManager = NativeModules.ARSceneViewManager;
export const { exportIntoFile } = ARSceneViewManager;

export default class ARScene extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <ARSceneView {...this.props} />;
    }
}
ARScene.propTypes = {
    debugEnabled: PropTypes.bool,
    run: PropTypes.bool,
};