import { pubKeyToAddress } from '@erebos/keccak256';
import { createKeyPair, sign } from '@erebos/secp256k1';
import { BzzAPI } from '@erebos/swarm';
import { ofType } from '@martin_hotell/rex-tils';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { Rxios } from 'rxios';
import { flatMap, map, withLatestFrom } from 'rxjs/operators';

import { AppState } from '@/store';
import { from, Observable } from 'rxjs';
import * as fromActions from './actions';

const BZZ_URL = 'https://swarm-gateways.net';

const http = new Rxios();

interface DerivePolicyEncryptingKeyResponse {
  result: {
    policy_encrypting_key: string;
    label: string;
  };
  version: string;
  duration: string;
}

const setDocumentIDEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.SET_DOCUMENT_ID),
    withLatestFrom(state$),
    flatMap(() => {
      const {
        document: { aliceBaseURL, documentID },
      } = state$.value;
      return http.post<DerivePolicyEncryptingKeyResponse>(
        `${aliceBaseURL}/derive_policy_encrypting_key/${documentID}`,
        undefined as any,
      );
    }),
    map(({ result: { policy_encrypting_key } }) => {
      return fromActions.Actions.setPolicyEncryptingKey(policy_encrypting_key);
    }),
  );

const loadDocumentEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.LOAD_DOCUMENT_FROM_SWARM),
    withLatestFrom(state$),
    flatMap(() => {
      const {
        document: { swarmPrivateKey, documentID },
      } = state$.value;

      const keyPair = createKeyPair(swarmPrivateKey);
      const user = pubKeyToAddress(keyPair.getPublic().encode());
      const signBytes = async (bytes: number[]) =>
        sign(bytes, keyPair.getPrivate());
      const bzz = new BzzAPI({
        url: BZZ_URL,
        signBytes,
      });
      return http.get<string>(`${BZZ_URL}/bzz:/${documentID}`);
    }),
    map((data) => {
      console.log(data);
      return fromActions.Actions.derp();
    }),
  );

const generateSwarmPrivateKey = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.LOAD_DOCUMENT_FROM_SWARM),
    withLatestFrom(state$),
    map(() => {
      const {
        document: { swarmPrivateKey: stateSwarmPrivateKey },
      } = state$.value;

      let swarmPrivateKey: string = stateSwarmPrivateKey;
      if (!stateSwarmPrivateKey) {
        const keyPair = createKeyPair();
        swarmPrivateKey = keyPair.getPrivate().toString();
      }

      return fromActions.Actions.setSwarmPrivateKey(swarmPrivateKey);
    }),
  );

export const epic = combineEpics(
  setDocumentIDEpic,
  generateSwarmPrivateKey,
  loadDocumentEpic,
);
