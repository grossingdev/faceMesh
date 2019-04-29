import { RNS3 } from 'react-native-aws3';

const options = {
  keyPrefix: "uploads/",
  bucket: "face-mesh-stl",
  region: "us-east-2",
  accessKey: "AKIAYN7X24RMKTGYUGOC",
  secretKey: "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",
  successActionStatus: 201
}

let instance = null;

export const uploadFile = (uri, name) => {
  const file = {
    uri,
    name,
    type: "stl"
  };
  instance = RNS3.put(file, options);
  return instance;
};

export const abortUpload = () => {
  instance.abort();
}
export const checkFile = async (name) => {
  const uri = `https://face-mesh-stl.s3.amazonaws.com/uploads%2F${name}`;
  const res = await fetch(uri);
  return res.status < 400;
}

