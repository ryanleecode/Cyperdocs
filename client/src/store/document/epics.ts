import { createKeyPair } from '@erebos/secp256k1';
import { ofType } from '@martin_hotell/rex-tils';
import automerge from 'automerge';
import {
  ActionsObservable,
  combineEpics,
  StateObservable,
} from 'redux-observable';
import { Rxios } from 'rxios';
import {
  catchError,
  delay,
  flatMap,
  map,
  withLatestFrom,
} from 'rxjs/operators';

import { AppState } from '@/store';
import crypto, { randomBytes } from 'crypto';
import { createHash } from 'crypto';
import moment from 'moment';
import { of, throwError } from 'rxjs';
import { Value } from 'slate';
import { automergeJsonToSlate } from 'slate-automerge';
import * as fromActions from './actions';
import {
  AuthenticateWithDecryptedTokenMessage,
  InitialStateMessage,
  IssueGrantMessage,
  RequestGrantMessage,
  RequestUpdatedDocumentFromPeerMessage,
  SendEncryptedTokenMessage,
  SendIdentityMessage,
  SendUpdatedDocumentMessage,
} from './connection-protocol';

interface EncryptedData {
  result: {
    message_kit: string;
    signature: string;
  };
}

interface BobPublicKeys {
  result: {
    bob_encrypting_key: string;
    bob_verifying_key: string;
  };
}

interface AliceGrant {
  result: {
    treasure_map: string;
    policy_encrypting_key: string;
    alice_verifying_key: string;
  };
}

interface BobRetrieve {
  result: {
    cleartexts: string[];
  };
}

const BZZ_URL = 'https://swarm-gateways.net';

const http = new Rxios({
  headers: { 'Cache-Control': 'no-cache' },
});

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

const startLoadingDocumentFromSwarmEpic = (
  action$: ActionsObservable<fromActions.Actions>,
) =>
  action$.pipe(
    ofType(fromActions.LOAD_DOCUMENT_FROM_SWARM),
    map(() => fromActions.Actions.tryFetchDocumentFromSwarm(0)),
  );

const logRetrievalCountEpic = (
  action$: ActionsObservable<fromActions.Actions>,
) =>
  action$.pipe(
    ofType(fromActions.LOG_RETRIEVAL_COUNT),
    map(() => fromActions.Actions.tryFetchDocumentFromSwarm(0)),
  );

const MAX_DOCUMENT_FETCH_ATTEMPTS = 5;
const REQUIRED_NUMBER_OF_FETCHES = 5;

const fetchDocumentEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.TRY_FETCH_DOCUMENT_FROM_SWARM),
    flatMap((action) => {
      const {
        document: { documentID, retrievalCounts },
      } = state$.value;

      return http.get<EncryptedData>(`${BZZ_URL}/bzz:/${documentID}`).pipe(
        map((encryptedData) => {
          const hash = crypto
            .createHash('sha256')
            .update(JSON.stringify(encryptedData))
            .digest('base64');
          if (retrievalCounts.get(hash, 0) >= REQUIRED_NUMBER_OF_FETCHES) {
            return fromActions.Actions.consumeFetchedDocument(encryptedData);
          } else {
            return fromActions.Actions.logRetrievalCount(hash);
          }
        }),
        catchError((error) => {
          if (!documentID) {
            return of(fromActions.Actions.createNewDocument());
          }
          if (action.payload >= MAX_DOCUMENT_FETCH_ATTEMPTS) {
            return throwError(error);
          }
          return of(undefined).pipe(
            delay(1000),
            map(() =>
              fromActions.Actions.tryFetchDocumentFromSwarm(action.payload + 1),
            ),
          );
        }),
      );
    }),
  );

/*   const keyPair = createKeyPair(swarmPrivateKey);
  const user = pubKeyToAddress(keyPair.getPublic().encode());
  const signBytes = async (bytes: number[]) =>
    sign(bytes, keyPair.getPrivate());
  const bzz = new BzzAPI({
    url: BZZ_URL,
    signBytes,
  });
 */
const consumeFetchedDocumentEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.CONSUME_FETCHED_DOCUMENT),
    flatMap(({ payload: encryptedData }) => {
      const {
        document: { fakeBobBaseURL, aliceBaseURL, documentID },
      } = state$.value;
      return http
        .get<BobPublicKeys>(`${fakeBobBaseURL}/public_keys`)
        .pipe(
          flatMap(({ result: { bob_encrypting_key, bob_verifying_key } }) =>
            http.put<AliceGrant>(`${aliceBaseURL}/grant`, {
              bob_verifying_key,
              bob_encrypting_key,
              m: 1,
              n: 1,
              label: documentID,
              expiration: moment()
                .add(1, 'day')
                .toISOString(),
            }),
          ),
        )
        .pipe(
          flatMap(
            ({
              result: {
                alice_verifying_key: aliceVerifyingKey,
                policy_encrypting_key: alicePolicyEncryptingKey,
              },
            }) => {
              return http.post<BobRetrieve>(`${fakeBobBaseURL}/retrieve`, {
                label: documentID,
                policy_encrypting_key: alicePolicyEncryptingKey,
                alice_verifying_key: aliceVerifyingKey,
                message_kit: encryptedData.result.message_kit,
              });
            },
          ),
        );
    }),
    map((bobRetrieve) => bobRetrieve.result.cleartexts[0]),
    map((clearText) => {
      const doc = JSON.parse(clearText);
      const newDoc = automerge.applyChanges(automerge.init(), doc);

      return fromActions.Actions.setDocumentData(newDoc);
    }),
  );

const setDocumentDataEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.SET_DOCUMENT_DATA),
    map(() => {
      const newDoc = state$.value.document.data;
      const updatedSlate = Value.fromJSON(automergeJsonToSlate(newDoc.value)!!);
      return fromActions.Actions.setSlateRepr(updatedSlate);
    }),
  );

const checkIfRemoteDocumentHashMatchesAfterChangesEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.CHECK_IF_REMOTE_DOCUMENT_HASH_MATCHES_AFTER_CHANGES),
    flatMap(({ payload: { connection, hash: remoteHash } }) => {
      return of({ remoteHash, connection });
    }),
    map(({ remoteHash, connection }) => {
      const peerID = state$.value.document.peerID;
      const { slateRepr } = state$.value.document;
      const currentHash = createHash('sha256')
        .update(JSON.stringify(slateRepr.toJSON()))
        .digest('base64');
      if (currentHash !== remoteHash) {
        const message: RequestUpdatedDocumentFromPeerMessage = {
          type: 'REQUEST_UPDATED_DOCUMENT_FROM_PEER',
        };
        connection.send(message);
        return fromActions.Actions.sentMessageOverWebsocket(message);
      }

      return fromActions.Actions.previousActionCompleted();
    }),
  );

const sendUpdatedDocumentEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.SEND_UPDATED_DOCUMENT),
    flatMap(({ payload: { connection, document } }) => {
      return of({ connection, document });
    }),
    map(({ connection, document }) => {
      const message: SendUpdatedDocumentMessage = {
        type: 'SEND_UPDATED_DOCUMENT_MESSAGE',
        document,
      };
      connection.send(message);
      return fromActions.Actions.sentMessageOverWebsocket(message);
    }),
  );

const createAuthenticationTokenForPeerEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.SEND_AUTHENTICATION_TOKEN_TO_PEER),
    flatMap(({ payload: { connection, bobVerifyingKey } }) => {
      const {
        document: { enricoBaseURL },
      } = state$.value;
      const token = randomBytes(48).toString('base64');

      return http
        .post<EncryptedData>(`${enricoBaseURL}/encrypt_message`, {
          message: token,
        })
        .pipe(
          map(({ result: { message_kit: encryptedToken } }) => {
            const label = state$.value.document.documentID;
            const message: SendEncryptedTokenMessage = {
              type: 'SEND_ENCRYPTED_TOKEN_MESSAGE',
              token: encryptedToken,
              label,
            };
            connection.send(message);

            return fromActions.Actions.sentAuthenticationTokenToPeer({
              bobVerifyingKey,
              token,
            });
          }),
        );
    }),
  );

const requestAliceGrantEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.REQUEST_GRANT_FROM_ALICE),
    flatMap(({ payload: { connection, label } }) => {
      const {
        document: { bobBaseURL },
      } = state$.value;
      return http.get<BobPublicKeys>(`${bobBaseURL}/public_keys`).pipe(
        map(({ result: { bob_encrypting_key, bob_verifying_key } }) => {
          const message: RequestGrantMessage = {
            type: 'REQUEST_GRANT_MESSAGE',
            label,
            bob: {
              encryptingKey: bob_encrypting_key,
              verifyingKey: bob_verifying_key,
            },
          };
          connection.send(message);

          return fromActions.Actions.sentMessageOverWebsocket(message);
        }),
      );
    }),
  );

const issueGrantEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.ISSUE_GRANT),
    flatMap(
      ({
        payload: {
          label, // tslint:disable-next-line:variable-name
          bobEncryptingKey: bob_encrypting_key, // tslint:disable-next-line:variable-name
          bobVerifyingKey: bob_verifying_key,
          connection,
        },
      }) => {
        const { aliceBaseURL } = state$.value.document;
        return http
          .put<AliceGrant>(`${aliceBaseURL}/grant`, {
            bob_verifying_key,
            bob_encrypting_key,
            m: 1,
            n: 1,
            label,
            expiration: moment().add(1, 'minute'),
          })
          .pipe(
            map(
              ({ result: { alice_verifying_key, policy_encrypting_key } }) => {
                const message: IssueGrantMessage = {
                  type: 'ISSUE_GRANT_MESSAGE',
                  label,
                  aliceVerifyingKey: alice_verifying_key,
                  policyEncryptingKey: policy_encrypting_key,
                };

                connection.send(message);
                return fromActions.Actions.sentMessageOverWebsocket(message);
              },
            ),
          );
      },
    ),
  );

const sendIdentityEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.SEND_IDENTITY),
    flatMap(({ payload: { connection } }) => {
      const bobBaseURL = state$.value.document.bobBaseURL;
      return http.get<BobPublicKeys>(`${bobBaseURL}/public_keys`).pipe(
        map(({ result: { bob_verifying_key } }) => {
          const message: SendIdentityMessage = {
            type: 'SEND_IDENTITY_MESSAGE',
            bobVerifyingKey: bob_verifying_key,
          };

          connection.send(message);

          return fromActions.Actions.sentMessageOverWebsocket(message);
        }),
      );
    }),
  );

const sendDecryptedAuthenticationTokenEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.AUTHENTICATE_WITH_DECRYPTED_AUTHENTICATION_TOKEN),
    flatMap(
      ({
        payload: {
          connection,
          encryptedToken,
          aliceVerifyingKey,
          policyEncryptingKey,
          label,
        },
      }) => {
        const bobBaseURL = state$.value.document.bobBaseURL;
        return http.get<BobPublicKeys>(`${bobBaseURL}/public_keys`).pipe(
          flatMap(({ result: { bob_verifying_key } }) => {
            return http
              .post<BobRetrieve>(`${bobBaseURL}/retrieve`, {
                label,
                policy_encrypting_key: policyEncryptingKey,
                alice_verifying_key: aliceVerifyingKey,
                message_kit: encryptedToken,
              })
              .pipe(
                map(({ result: { cleartexts } }) => {
                  const message: AuthenticateWithDecryptedTokenMessage = {
                    type: 'AUTHENTICATE_WITH_DECRYPTED_TOKEN_MESSAGE',
                    bobVerifyingKey: bob_verifying_key,
                    token: cleartexts[0],
                  };

                  connection.send(message);

                  return fromActions.Actions.sentMessageOverWebsocket(message);
                }),
              );
          }),
        );
      },
    ),
  );

const authorizePeerEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.AUTHORIZE_PEER),
    map(({ payload: { decryptedToken, bobVerifyingKey, connection } }) => {
      const { authentications } = state$.value.document;
      const storedToken = authentications.get(bobVerifyingKey);

      if (storedToken === decryptedToken) {
        return fromActions.Actions.addAuthorizedPeer(connection);
      }
      return;
    }),
  );

const sendInitialDataToPeerEpic = (
  action$: ActionsObservable<fromActions.Actions>,
  state$: StateObservable<AppState>,
) =>
  action$.pipe(
    ofType(fromActions.ADD_AUTHORIZED_PEER),
    map(({ payload: connection }) => {
      const currentDoc = state$.value.document.data;
      const changeData = JSON.stringify(
        automerge.getChanges(automerge.init(), currentDoc),
      );

      const msg: InitialStateMessage = {
        type: 'INITIAL_STATE_MESSAGE',
        initialState: changeData,
      };

      connection.send(msg);
      return fromActions.Actions.sentMessageOverWebsocket(msg);
    }),
  );

export const epic = combineEpics(
  setDocumentIDEpic,
  generateSwarmPrivateKey,
  startLoadingDocumentFromSwarmEpic,
  fetchDocumentEpic,
  consumeFetchedDocumentEpic,
  sendInitialDataToPeerEpic,
  logRetrievalCountEpic,
  setDocumentDataEpic,
  checkIfRemoteDocumentHashMatchesAfterChangesEpic,
  sendUpdatedDocumentEpic,
  createAuthenticationTokenForPeerEpic,
  requestAliceGrantEpic,
  issueGrantEpic,
  sendIdentityEpic,
  sendDecryptedAuthenticationTokenEpic,
  authorizePeerEpic,
);
