import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Doc } from 'automerge';
import Immutable from 'immutable';
import { Set } from 'immutable';
import Peer from 'peerjs';
import { Value } from 'slate';
import { Operation } from 'slate';

export const SET_DOCUMENT_ID = 'SET_DOCUMENT_ID';
export const SET_POLICY_ENCRYPTING_KEY = 'SET_POLICY_ENCRYPTING_KEY';
export const SET_ALICE_BASE_URL = 'SET_ALICE_BASE_URL';
export const SET_ENRICO_BASE_URL = 'SET_ENRICO_BASE_URL';
export const SET_SWARM_PRIVATE_KEY = 'SET_SWARM_PRIVATE_KEY';
export const SET_FAKE_BOB_BASE_URL = 'SET_FAKE_BOB_BASE_URL';
export const LOAD_DOCUMENT_FROM_SWARM = 'LOAD_DOCUMENT_FROM_SWARM';
export const TRY_FETCH_DOCUMENT_FROM_SWARM = 'TRY_FETCH_DOCUMENT_FROM_SWARM';
export const CREATE_NEW_DOCUMENT = 'CREATE_NEW_DOCUMENT';
export const CONSUME_FETCHED_DOCUMENT = 'CONSUME_FETCHED_DOCUMENT';
export const SYNC_DOCUMENT_WITH_CURRENT_SLATE_DATA =
  'SYNC_DOCUMENT_WITH_CURRENT_SLATE_DATA';
export const APPLY_LOCAL_CHANGES_TO_DOCUMENT =
  'APPLY_LOCAL_CHANGES_TO_DOCUMENT';
export const SET_SLATE_REPR = 'SET_SLATE_REPR';
export const SET_PEER_ID = 'SET_PEER_ID';
export const SET_DOCUMENT_DATA = 'SET_DOCUMENT_DATA';
export const SEND_PEER_ID_TO_CONNECTING_PEER =
  'SEND_PEER_ID_TO_CONNECTING_PEER';
export const PREVIOUS_ACTION_COMPLETED = 'PREVIOUS_ACTION_COMPLETED';
export const LOG_RETRIEVAL_COUNT = 'LOG_RETRIEVAL_COUNT';
export const APPLY_REMOTE_CHANGE_TO_DOCUMENT =
  'APPLY_REMOTE_CHANGE_TO_DOCUMENT';
export const CHECK_IF_REMOTE_DOCUMENT_HASH_MATCHES_AFTER_CHANGES =
  'CHECK_IF_REMOTE_DOCUMENT_HASH_MATCHES_AFTER_CHANGES';
export const SEND_UPDATED_DOCUMENT = 'SEND_UPDATED_DOCUMENT';
export const SET_BOB_BASE_URL = 'SET_BOB_BASE_URL';
export const SEND_AUTHENTICATION_TOKEN_TO_PEER =
  'SEND_AUTHENTICATION_TOKEN_TO_PEER';
export const SENT_AUTHENTICATION_TOKEN_TO_PEER =
  'SENT_AUTHENTICATION_TOKEN_TO_PEER';
export const REQUEST_GRANT_FROM_ALICE = 'REQUEST_GRANT_FROM_ALICE';
export const SENT_MESSAGE_OVER_WEBSOCKET = 'SENT_MESSAGE_OVER_WEBSOCKET';
export const ISSUE_GRANT = 'ISSUE_GRANT';
export const SEND_IDENTITY = 'SEND_IDENTITY';
export const AUTHENTICATE_WITH_DECRYPTED_AUTHENTICATION_TOKEN =
  'AUTHENTICATE_WITH_DECRYPTED_AUTHENTICATION_TOKEN';
export const AUTHORIZE_PEER = 'AUTHORIZE_PEER';
export const ADD_AUTHORIZED_PEER = 'ADD_AUTHORIZED_PEER';
export const SEND_CHANGES_TO_PEERS = 'SEND_CHANGES_TO_PEERS';
export const REJECT_CONNECTION = 'REJECT_CONNECTION';
export const REMOVE_AUTHORIZED_PEER = 'REMOVE_AUTHORIZED_PEER';
export const INITIALIZE_SWARM_DOCUMENT_WITH_DEFAULT_VALUES =
  'INITIALIZE_SWARM_DOCUMENT_WITH_DEFAULT_VALUES';

export interface EncryptedData {
  result: {
    message_kit: string;
    signature: string;
  };
}

export interface ConnectionActionPayload {
  connection: Peer.DataConnection;
}

export interface SendPeerIDToConnectingPeerPayload
  extends ConnectionActionPayload {
  peerID: string;
}

export interface SendInitialDocumentStateToIncomingPeerPayload
  extends ConnectionActionPayload {
  serializedChanges: string;
}

export interface CheckIfRemoteSlateHashMatchesAfterChangePayload {
  hash: string;
  connection: Peer.DataConnection;
}

export interface SendUpdatedDocumentPayload {
  connection: Peer.DataConnection;
  document: string;
}

export interface SendAuthenticationTokenToPeerPayload {
  bobVerifyingKey: string;
  connection: Peer.DataConnection;
}

export interface SentAuthenticationTokenToPeer {
  bobVerifyingKey: string;
  token: string;
}

export interface RequestGrantFromAlicePayload {
  label: string;
  connection: Peer.DataConnection;
}

export interface IssueGrantPayload {
  label: string;
  bobVerifyingKey: string;
  bobEncryptingKey: string;
  connection: Peer.DataConnection;
}

export interface SendIdentityPayload {
  connection: Peer.DataConnection;
}

export interface AuthenticateWithDecryptedAuthenticationTokenPayload {
  label: string;
  encryptedToken: string;
  aliceVerifyingKey: string;
  policyEncryptingKey: string;
  connection: Peer.DataConnection;
}

export interface AuthorizePeerPayload {
  bobVerifyingKey: string;
  decryptedToken: string;
  connection: Peer.DataConnection;
}

export interface SendChangesToPeersPayload {
  peers: Set<Peer.DataConnection>;
  changeData: string;
  slateHash: string;
}

export interface RejectConnectionPayload {
  connection: Peer.DataConnection;
}

export interface AddAuthorizedPeerPayload {
  connection: Peer.DataConnection;
  bobVerifyingKey: string;
}

export const Actions = {
  setDocumentID: (documentID: string) =>
    createAction(SET_DOCUMENT_ID, documentID),
  setPolicyEncryptingKey: (policyEncryptingKey: string) =>
    createAction(SET_POLICY_ENCRYPTING_KEY, policyEncryptingKey),
  setAliceBaseURL: (aliceBaseURL: string) =>
    createAction(SET_ALICE_BASE_URL, aliceBaseURL),
  setEnricoBaseURL: (enricoBaseURL: string) =>
    createAction(SET_ENRICO_BASE_URL, enricoBaseURL),
  setFakeBobBaseURL: (fakeBobBaseURL: string) =>
    createAction(SET_FAKE_BOB_BASE_URL, fakeBobBaseURL),
  setSwarmPrivateKey: (swarmPrivateKey: string) =>
    createAction(SET_SWARM_PRIVATE_KEY, swarmPrivateKey),
  loadDocumentFromSwarm: () => createAction(LOAD_DOCUMENT_FROM_SWARM),
  tryFetchDocumentFromSwarm: (attempt: number) =>
    createAction(TRY_FETCH_DOCUMENT_FROM_SWARM, attempt),
  createNewDocument: () => createAction(CREATE_NEW_DOCUMENT),
  consumeFetchedDocument: (data: EncryptedData) =>
    createAction(CONSUME_FETCHED_DOCUMENT, data),
  syncDocumentWithCurrentSlateData: () =>
    createAction(SYNC_DOCUMENT_WITH_CURRENT_SLATE_DATA),
  applyLocalChange: (operations: Immutable.List<Operation>) =>
    createAction(APPLY_LOCAL_CHANGES_TO_DOCUMENT, operations),
  setSlateRepr: (value: Value) => createAction(SET_SLATE_REPR, value),
  setPeerID: (peerID: string) => createAction(SET_PEER_ID, peerID),
  setDocumentData: (data: Doc) => createAction(SET_DOCUMENT_DATA, data),
  sendPeerIDToConnectingPeer: (payload: SendPeerIDToConnectingPeerPayload) =>
    createAction(SEND_PEER_ID_TO_CONNECTING_PEER, payload),
  previousActionCompleted: () => createAction(PREVIOUS_ACTION_COMPLETED),
  logRetrievalCount: (hash: string) => createAction(LOG_RETRIEVAL_COUNT, hash),
  applyRemoteChangeToDocument: (changes: { [key: string]: any }) =>
    createAction(APPLY_REMOTE_CHANGE_TO_DOCUMENT, changes),
  checkifRemoteSlateHashMatchesAfterChange: (
    payload: CheckIfRemoteSlateHashMatchesAfterChangePayload,
  ) =>
    createAction(CHECK_IF_REMOTE_DOCUMENT_HASH_MATCHES_AFTER_CHANGES, payload),
  sendUpdatedDocument: (payload: SendUpdatedDocumentPayload) =>
    createAction(SEND_UPDATED_DOCUMENT, payload),
  setBobBaseURL: (url: string) => createAction(SET_BOB_BASE_URL, url),
  sendAuthenticationTokenToPeer: (
    payload: SendAuthenticationTokenToPeerPayload,
  ) => createAction(SEND_AUTHENTICATION_TOKEN_TO_PEER, payload),
  sentAuthenticationTokenToPeer: (payload: SentAuthenticationTokenToPeer) =>
    createAction(SENT_AUTHENTICATION_TOKEN_TO_PEER, payload),
  requestGrantFromAlice: (payload: RequestGrantFromAlicePayload) =>
    createAction(REQUEST_GRANT_FROM_ALICE, payload),
  sentMessageOverWebsocket: (payload: any) =>
    createAction(SENT_MESSAGE_OVER_WEBSOCKET, payload),
  issueGrant: (payload: IssueGrantPayload) =>
    createAction(ISSUE_GRANT, payload),
  sendIdentity: (payload: SendIdentityPayload) =>
    createAction(SEND_IDENTITY, payload),
  authenticateWithDecryptedAuthenticationToken: (
    payload: AuthenticateWithDecryptedAuthenticationTokenPayload,
  ) => createAction(AUTHENTICATE_WITH_DECRYPTED_AUTHENTICATION_TOKEN, payload),
  authenticatePeer: (payload: AuthorizePeerPayload) =>
    createAction(AUTHORIZE_PEER, payload),
  addAuthorizedPeer: (payload: AddAuthorizedPeerPayload) =>
    createAction(ADD_AUTHORIZED_PEER, payload),
  sendChangesToPeers: (payload: SendChangesToPeersPayload) =>
    createAction(SEND_CHANGES_TO_PEERS, payload),
  rejectConnection: (payload: RejectConnectionPayload) =>
    createAction(REJECT_CONNECTION, payload),
  removeAuthorizedPeer: (peerID: string) =>
    createAction(REMOVE_AUTHORIZED_PEER, peerID),
  initializeSwarmDocumnentWithDefaultValues: () =>
    createAction(INITIALIZE_SWARM_DOCUMENT_WITH_DEFAULT_VALUES),
};

export type Actions = ActionsUnion<typeof Actions>;
