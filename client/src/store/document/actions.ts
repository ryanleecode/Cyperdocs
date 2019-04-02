import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';
import { Document } from 'slate';

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
export const FILL_DOCUMENT_WITH_DEFAULT_DATA =
  'FILL_DOCUMENT_WITH_DEFAULT_DATA';

export interface EncryptedData {
  result: {
    message_kit: string;
    signature: string;
  };
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
  fillDocumentWithDefaultData: (data: Document) =>
    createAction(FILL_DOCUMENT_WITH_DEFAULT_DATA, data),
  derp: () => createAction('derp'),
  yolo: () => createAction('yolo'),
};

export type Actions = ActionsUnion<typeof Actions>;
