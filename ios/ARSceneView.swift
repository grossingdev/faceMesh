//
//  ARSceneView.swift
//  faceMesh
//
//  Created by dev on 24/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//
import Foundation
import UIKit
import ARKit
import SceneKit


@objc public class ARSceneView: ARSCNView, ARSCNViewDelegate, ARSessionDelegate {
  var faceNode: Mask?
  var flagDisableUpdate: Bool = false
  var cameraSource: Any?
  var utilities = Utilities()
  var config: ARFaceTrackingConfiguration = ARFaceTrackingConfiguration()
  var isCameraEnabled: Bool = true {
    didSet {
      if isCameraEnabled {
        self.scene.background.contents = cameraSource
      } else {
        cameraSource = self.scene.background.contents
        self.scene.background.contents = UIColor.black
      }
    }
  }
  
  @objc
  public func disableFaceAnchorUpdate(value: ObjCBool) {
    flagDisableUpdate = value.boolValue
    self.session.run(self.config)
  }
  
  @objc
  public func exportIntoFile(callback: RCTResponseSenderBlock) {
    guard let a = session.currentFrame?.anchors[0] as? ARFaceAnchor else { return }
    
    let toprint = utilities.exportToSTL(geometry: a.geometry)
    let strFileName = flagDisableUpdate ? "baseFace.stl" : "face.stl"
    let file = NSURL(fileURLWithPath: NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]).appendingPathComponent(strFileName)
    do {
      try toprint.write(to: file!, atomically: true, encoding: String.Encoding.utf8)
      callback([file?.absoluteString])
    } catch  {
      callback([""])
    }
  }
  public override init(frame: CGRect) {
    super.init(frame: frame)
    self.initializeSessionAndProps()
  }
  
  public override init(frame: CGRect, options: [String : Any]? = nil) {
    super.init(frame: frame, options: options)
    self.initializeSessionAndProps()
  }
  
  required public init?(coder aDecoder: NSCoder) {
    super.init(coder: aDecoder)
  }
  
  func initializeSessionAndProps() {
    self.config = ARFaceTrackingConfiguration()
    self.delegate = self
    self.session.run(self.config)
    self.session.delegate = self
    self.autoenablesDefaultLighting = true
    cameraSource = self.scene.background.contents
  }
  
  override public func layoutSubviews() {
    super.layoutSubviews()
    self.backgroundColor = UIColor.blue
  }
  
  @objc
  func setDebugEnabled(_ isEnabled: Bool) {
    if (isEnabled) {
      self.showsStatistics = true
      self.debugOptions = [ARSCNDebugOptions.showWorldOrigin, ARSCNDebugOptions.showFeaturePoints]
    } else {
      self.showsStatistics = false
      self.debugOptions = []
    }
    self.delegate = self
    
  }
  
  @objc
  func setShowCamera(_ isCameraEnabled: Bool) {
    if isCameraEnabled {
      self.scene.background.contents = cameraSource
    } else {
      cameraSource = self.scene.background.contents
      self.scene.background.contents = UIColor.black
    }
    
    self.delegate = self
    
  }
  func setRun(_ shouldRun: Bool) {
    if shouldRun == false {
      self.session.pause()
    } else {
      self.session.run(self.config)
    }
  }
  
  public func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
    let mask = ARSCNFaceGeometry(device: self.device!)
    let maskNode = Mask(geometry: mask!)
    faceNode = maskNode
    DispatchQueue.main.async {
      for child in node.childNodes {
        child.removeFromParentNode()
      }
      node.addChildNode(maskNode)
    }
  }
  
  public func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
    guard let faceAnchor = anchor as? ARFaceAnchor else { return }
    if (!flagDisableUpdate) {
      faceNode?.update(withFaceAnchor: faceAnchor)
    } else {
      let mask = ARSCNFaceGeometry(device: self.device!)
      let maskNode = Mask(geometry: mask!)
      faceNode = maskNode
      DispatchQueue.main.async {
        for child in node.childNodes {
          child.removeFromParentNode()
        }
        node.addChildNode(maskNode)
      }
    }
  }
  
  // We are overwriting addSubview that React-Native calls
  // by default to translate these actions into
  // SceneKit actions. addSubview becomes addChildNode
  override public func addSubview(_ view: UIView) {
    let obj:Any = view as Any
    if let node: SCNNode = obj as? SCNNode {
      self.scene.rootNode.addChildNode(node)
    } else {
      super.addSubview(view)
    }
    self.config = ARFaceTrackingConfiguration()
    self.delegate = self
    self.session.run(self.config)
    self.session.delegate = self
    
  }
}

