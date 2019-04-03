import automerge from 'automerge';
import { Map } from 'immutable';
import { Value } from 'slate';
import { applySlateOperations, slateCustomToJson } from 'slate-automerge';
import * as fromActions from './actions';

export const initialState = {
  documentID: '',
  policyEncryptingKey: '',
  aliceBaseURL: 'http://localhost:8151',
  enricoBaseURL: 'http://localhost:5151',
  fakeBobBaseURL: 'http://localhost:11161',
  swarmPrivateKey: '',
  slateRepr: Value.fromJSON({}),
  data: automerge.init(),
  peerID: '',
  retrievalCounts: Map<string, number>(),
};
export type State = typeof initialState;

export const reducer = (
  state = initialState,
  action: fromActions.Actions,
): State => {
  switch (action.type) {
    case fromActions.SYNC_DOCUMENT_WITH_CURRENT_SLATE_DATA: {
      const currentDoc = state.data;
      const newDoc = automerge.change(
        currentDoc,
        fromActions.SYNC_DOCUMENT_WITH_CURRENT_SLATE_DATA,
        (doc: { value: any }) =>
          (doc.value = slateCustomToJson(state.slateRepr)),
      );
      return { ...state, data: newDoc };
    }
    case fromActions.APPLY_LOCALS_CHANGE_TO_DOCUMENT: {
      const currentDoc = state.data;
      const throwawayDocSet = new automerge.DocSet();
      const throwawayID = 'abc';
      throwawayDocSet.setDoc(throwawayID, currentDoc);
      applySlateOperations(throwawayDocSet, throwawayID, action.payload, '');
      const newDoc = throwawayDocSet.getDoc(throwawayID)!!;

      return { ...state, data: newDoc };
    }
    case fromActions.LOG_RETRIEVAL_COUNT: {
      const currentRetrievalCounts = state.retrievalCounts;
      const hash = action.payload;
      const newRetrievalCounts = currentRetrievalCounts.set(
        hash,
        currentRetrievalCounts.get(hash, 0) + 1,
      );

      return { ...state, retrievalCounts: newRetrievalCounts };
    }
    case fromActions.CONSUME_FETCHED_DOCUMENT: {
      return { ...state, retrievalCounts: Map() };
    }
    case fromActions.LOAD_DOCUMENT_FROM_SWARM: {
      return { ...state, retrievalCounts: Map() };
    }
    case fromActions.SET_SLATE_REPR: {
      return { ...state, slateRepr: action.payload };
    }
    case fromActions.SET_PEER_ID: {
      return { ...state, peerID: action.payload };
    }
    case fromActions.SET_DOCUMENT_DATA: {
      return { ...state, data: action.payload };
    }
    case fromActions.SET_DOCUMENT_ID: {
      return { ...state, documentID: action.payload };
    }
    case fromActions.SET_ALICE_BASE_URL: {
      return { ...state, aliceBaseURL: action.payload };
    }
    case fromActions.SET_FAKE_BOB_BASE_URL: {
      return { ...state, fakeBobBaseURL: action.payload };
    }
    case fromActions.SET_POLICY_ENCRYPTING_KEY: {
      return { ...state, policyEncryptingKey: action.payload };
    }
    case fromActions.SET_SWARM_PRIVATE_KEY: {
      return { ...state, swarmPrivateKey: action.payload };
    }
    default:
      return state;
  }
};
