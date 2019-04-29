//
//  ARSceneViewManager.m
//  faceMesh
//
//  Created by dev on 24/04/2019.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <React/RCTComponent.h>

#import "faceMesh-Swift.h"

@interface ARSceneViewManager : RCTViewManager

@end

@implementation ARSceneViewManager

ARSceneView *view;
RCT_EXPORT_MODULE()

- (UIView *)view
{
  view = [[ARSceneView alloc] init];
  return view;
}

RCT_EXPORT_VIEW_PROPERTY(debugEnabled, BOOL)
RCT_EXPORT_VIEW_PROPERTY(showCamera, BOOL)
RCT_EXPORT_VIEW_PROPERTY(run, BOOL)

RCT_EXPORT_METHOD(exportIntoFile) {
  [view exportIntoFile];
}

@end
