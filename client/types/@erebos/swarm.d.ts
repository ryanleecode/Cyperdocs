interface DownloadResponse {
  text(): Promise<string>;
}

export class BzzAPI {
  constructor(config: any);
  createFeedManifest(params: any, options?: any): Promise<string>;
  deleteResource(hash: any, path: any, options: any): any;
  download(hash: string, options?: any): Promise<DownloadResponse>;
  downloadDirectoryData(hash: any, options: any): any;
  downloadDirectoryTo(hash: any, toPath: any, options: any): any;
  downloadFileTo(hash: any, toPath: any, options: any): void;
  downloadObservable(hash: any, options: any): any;
  downloadTo(hash: any, toPath: any, options: any): void;
  getDownloadURL(hash: any, options: any, raw: any): any;
  getFeedMetadata(hashOrParams: any, options: any): any;
  getFeedURL(hashOrParams: any, flag: any): any;
  getFeedValue(hashOrParams: any, options: any): any;
  getUploadURL(options: any, raw: any): any;
  hash(domain: any, options: any): any;
  list(hash: any, options: any): any;
  pollFeedValue(hashOrParams: any, options: any): any;
  postFeedValue(meta: any, data: any, options: any, signParams: any): any;
  postSignedFeedValue(params: any, body: any, options: any): any;
  sign(bytes: any, params: any): any;
  updateFeedValue(
    hashOrParams: any,
    data: any,
    options: any,
    signParams?: any,
  ): any;
  upload(data: any, options: any): Promise<string>;
  uploadDirectory(directory: any, options: any): any;
  uploadDirectoryFrom(path: any, options: any): any;
  uploadFeedValue(
    hashOrParams: any,
    data: any,
    options: any,
    signParams?: any,
  ): any;
  uploadFile(data: any, options: any): any;
  uploadFileFrom(path: any, options: any): any;
  uploadFileStream(stream: any, options: any): any;
  uploadFrom(path: any, options: any): any;
  uploadTar(path: any, options: any): any;
}
export class Hex {
  constructor(inputValue: any);
  equals(other: any): any;
  toBuffer(): any;
  toBytesArray(): any;
  toObject(): any;
}
export class PssAPI {
  constructor(rpc: any);
  baseAddr(): any;
  createSubscription(subscription: any): any;
  createTopicSubscription(topic: any, handleRawMessages: any): any;
  getPublicKey(): any;
  sendAsym(key: any, topic: any, message: any): any;
  sendRaw(address: any, topic: any, message: any): any;
  sendSym(keyID: any, topic: any, message: any): any;
  setPeerPublicKey(key: any, topic: any, address: any): any;
  setSymmetricKey(
    key: any,
    topic: any,
    address: any,
    useForDecryption: any,
  ): any;
  stringToTopic(str: any): any;
  subscribeTopic(topic: any, handleRawMessages: any): any;
}
export class SwarmClient {
  constructor(config: any);
  disconnect(): void;
  bzz: BzzAPI;
}
export function createHex(input: any): any;
export function createRPC(endpoint: any): any;
export function hexValueType(input: any): any;
