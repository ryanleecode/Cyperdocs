import { ActionsUnion, createAction } from '@martin_hotell/rex-tils';

export const SET_DOCUMENT_ID = 'SET_DOCUMENT_ID';
export const SET_POLICY_ENCRYPTING_KEY = 'SET_POLICY_ENCRYPTING_KEY';
export const SET_ALICE_BASE_URL = 'SET_ALICE_BASE_URL';
export const SET_ENRICO_BASE_URL = 'SET_ENRICO_BASE_URL';
export const SET_SWARM_PRIVATE_KEY = 'SET_SWARM_PRIVATE_KEY';
export const SET_FAKE_BOB_BASE_URL = 'SET_FAKE_BOB_BASE_URL';
export const LOAD_DOCUMENT_FROM_SWARM = 'LOAD_DOCUMENT_FROM_SWARM';

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
  derp: () => createAction('derp'),
};

export type Actions = ActionsUnion<typeof Actions>;
