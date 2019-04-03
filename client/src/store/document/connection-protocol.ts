export interface InitialConnectionMessage {
  type: 'INITIAL_CONNECTION_MESSAGE';
  peerID: string;
}

export interface InitialStateMessage {
  type: 'INITIAL_STATE_MESSAGE';
  initialState: string;
}
