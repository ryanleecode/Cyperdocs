import automerge from 'automerge';
import produce from 'immer';
import { Map } from 'immutable';
import { slateCustomToJson } from 'slate-automerge';
import * as fromActions from './actions';

export const initialState = {
  documentID: '',
  policyEncryptingKey: '',
  aliceBaseURL: 'http://localhost:8151',
  enricoBaseURL: 'http://localhost:5151',
  fakeBobBaseURL: 'http://localhost:11161',
  swarmPrivateKey: '',
  data: automerge.init(),
};
export type State = typeof initialState;

export const reducer = (
  state = initialState,
  action: fromActions.Actions,
): State => {
  switch (action.type) {
    case fromActions.FILL_DOCUMENT_WITH_DEFAULT_DATA: {
      const currentDoc = state.data;
      const newDoc = automerge.change(
        currentDoc,
        fromActions.FILL_DOCUMENT_WITH_DEFAULT_DATA,
        (doc: { value: any }) =>
          (doc.value = slateCustomToJson(action.payload)),
      );
      return { ...state, data: newDoc };
    }
    default:
      return produce(state, (draft) => {
        switch (action.type) {
          case fromActions.SET_DOCUMENT_ID: {
            draft.documentID = action.payload;
            break;
          }
          case fromActions.SET_ALICE_BASE_URL: {
            draft.aliceBaseURL = action.payload;
            break;
          }
          case fromActions.SET_FAKE_BOB_BASE_URL: {
            draft.fakeBobBaseURL = action.payload;
            break;
          }
          case fromActions.SET_POLICY_ENCRYPTING_KEY: {
            draft.policyEncryptingKey = action.payload;
            break;
          }
          case fromActions.SET_SWARM_PRIVATE_KEY: {
            draft.swarmPrivateKey = action.payload;
            break;
          }
          default:
            break;
        }
      });
  }
};
