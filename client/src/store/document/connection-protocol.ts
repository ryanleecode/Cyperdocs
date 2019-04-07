export interface InitialStateMessage {
  type: 'INITIAL_STATE_MESSAGE';
  initialState: string;
}

export interface RequestUpdatedDocumentFromPeerMessage {
  type: 'REQUEST_UPDATED_DOCUMENT_FROM_PEER';
}

export interface SendUpdatedDocumentMessage {
  type: 'SEND_UPDATED_DOCUMENT_MESSAGE';
  document: string;
}

export interface SendEncryptedTokenMessage {
  type: 'SEND_ENCRYPTED_TOKEN_MESSAGE';
  label: string;
  token: string;
}

export interface RequestGrantMessage {
  type: 'REQUEST_GRANT_MESSAGE';
  label: string;
  bob: {
    encryptingKey: string;
    verifyingKey: string;
  };
}

export interface IssueGrantMessage {
  type: 'ISSUE_GRANT_MESSAGE';
  label: string;
  policyEncryptingKey: string;
  aliceVerifyingKey: string;
}

export interface SendIdentityMessage {
  type: 'SEND_IDENTITY_MESSAGE';
  bobVerifyingKey: string;
}

export interface AuthenticateWithDecryptedTokenMessage {
  type: 'AUTHENTICATE_WITH_DECRYPTED_TOKEN_MESSAGE';
  bobVerifyingKey: string;
  token: string;
}

export interface ChangeMessage {
  type: 'CHANGE';
  changeData: string;
  slateHash: string;
}

export interface BadAuthorizationMessage {
  type: 'BAD_AUTHORIZATION';
  label: string;
}

export interface RejectConnectionMessage {
  type: 'REJECT_CONNECTION';
}
