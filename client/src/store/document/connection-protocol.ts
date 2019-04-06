export interface InitialConnectionMessage {
  type: 'INITIAL_CONNECTION_MESSAGE';
  peerID: string;
}

export interface InitialStateMessage {
  type: 'INITIAL_STATE_MESSAGE';
  initialState: string;
}

export interface RequestUpdatedDocumentFromPeerMessage {
  type: 'REQUEST_UPDATED_DOCUMENT_FROM_PEER';
  originPeerID: string;
}

export interface SendUpdatedDocumentMessage {
  type: 'SEND_UPDATED_DOCUMENT_MESSAGE';
  document: string;
}
