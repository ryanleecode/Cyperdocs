import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Doc } from 'automerge';
import Immutable from 'immutable';
import Peer from 'peerjs';
import { Document, Value } from 'slate';
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
export const APPLY_LOCALS_CHANGE_TO_DOCUMENT =
  'APPLY_LOCALS_CHANGE_TO_DOCUMENT';
export const SET_SLATE_REPR = 'SET_SLATE_REPR';
export const SET_PEER_ID = 'SET_PEER_ID';
export const SET_DOCUMENT_DATA = 'SET_DOCUMENT_DATA';
export const SEND_PEER_ID_TO_CONNECTING_PEER =
  'SEND_PEER_ID_TO_CONNECTING_PEER';
export const PREVIOUS_ACTION_COMPLETED = 'PREVIOUS_ACTION_COMPLETED';
export const SEND_INITIAL_DOCUMENT_STATE_TO_INCOMING_PEER =
  'SEND_INITIAL_DOCUMENT_STATE_TO_INCOMING_PEER';
export const LOG_RETRIEVAL_COUNT = 'LOG_RETRIEVAL_COUNT';

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
    createAction(APPLY_LOCALS_CHANGE_TO_DOCUMENT, operations),
  setSlateRepr: (value: Value) => createAction(SET_SLATE_REPR, value),
  setPeerID: (peerID: string) => createAction(SET_PEER_ID, peerID),
  setDocumentData: (data: Doc) => createAction(SET_DOCUMENT_DATA, data),
  sendPeerIDToConnectingPeer: (payload: SendPeerIDToConnectingPeerPayload) =>
    createAction(SEND_PEER_ID_TO_CONNECTING_PEER, payload),
  sendInitialDocumentStateToIncomingPeer: (
    payload: SendInitialDocumentStateToIncomingPeerPayload,
  ) => createAction(SEND_INITIAL_DOCUMENT_STATE_TO_INCOMING_PEER, payload),
  previousActionCompleted: () => createAction(PREVIOUS_ACTION_COMPLETED),
  logRetrievalCount: (hash: string) => createAction(LOG_RETRIEVAL_COUNT, hash),
  derp: () => createAction('derp'),
  yolo: () => createAction('yolo'),
};

export type Actions = ActionsUnion<typeof Actions>;
