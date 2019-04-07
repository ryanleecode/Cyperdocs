import automerge from 'automerge';
import { Map, Set } from 'immutable';
import { Value } from 'slate';
import {
  applyAutomergeOperations,
  applySlateOperations,
  automergeJsonToSlate,
  slateCustomToJson,
} from 'slate-automerge';
import * as fromActions from './actions';

type BobVerifyingKey = string;
type Token = string;

export const initialState = {
  documentID: '',
  policyEncryptingKey: '',
  aliceBaseURL: 'http://localhost:8151',
  enricoBaseURL: 'http://localhost:5151',
  fakeBobBaseURL: 'http://localhost:11161',
  bobBaseURL: 'http://localhost:11151',
  swarmPrivateKey: '',
  slateRepr: Value.fromJSON({}),
  data: automerge.init(),
  peerID: '',
  retrievalCounts: Map<string, number>(),
  isLoading: false,
  authorizedPeers: Set<string>(),
  authentications: Map<BobVerifyingKey, Token>(),
};
export type State = typeof initialState;

export const reducer = (
  state = initialState,
  action: fromActions.Actions,
): State => {
  switch (action.type) {
    case fromActions.ADD_AUTHORIZED_PEER: {
      const { authorizedPeers } = state;
      return {
        ...state,
        authorizedPeers: authorizedPeers.add(action.payload.peer),
      };
    }
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
    case fromActions.APPLY_LOCAL_CHANGES_TO_DOCUMENT: {
      const currentDoc = state.data;
      const throwawayDocSet = new automerge.DocSet();
      const throwawayID = '123';
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
    case fromActions.APPLY_REMOTE_CHANGE_TO_DOCUMENT: {
      const changeData = action.payload;

      const currentDoc = state.data;

      const newDoc = automerge.applyChanges(currentDoc!!, changeData);
      const opSetDiff = automerge.diff(currentDoc!!, newDoc);

      if (opSetDiff.length > 0) {
        const { slateRepr } = state;
        let change = (slateRepr as any).change();
        let hasFailed = false;
        let newJSON: any;
        change = applyAutomergeOperations(opSetDiff, change, () => {
          hasFailed = true;
          newJSON = automergeJsonToSlate(newDoc.value)!!;
        });

        if (hasFailed) {
          return {
            ...state,
            slateRepr: Value.fromJSON(newJSON),
            data: newDoc,
          };
        }

        if (!change) {
          return state;
        } else {
          return {
            ...state,
            slateRepr: change.value,
            data: newDoc,
          };
        }
      }

      return state;
    }
    case fromActions.SENT_AUTHENTICATION_TOKEN_TO_PEER: {
      const { bobVerifyingKey, token } = action.payload;
      const currentAuthentications = state.authentications;
      const newAuthentications = currentAuthentications.set(
        bobVerifyingKey,
        token,
      );

      return { ...state, authentications: newAuthentications };
    }
    case fromActions.CONSUME_FETCHED_DOCUMENT: {
      return { ...state, retrievalCounts: Map(), isLoading: false };
    }
    case fromActions.LOAD_DOCUMENT_FROM_SWARM: {
      return { ...state, retrievalCounts: Map(), isLoading: true };
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
