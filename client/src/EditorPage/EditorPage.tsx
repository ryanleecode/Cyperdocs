import { Theme } from '@/App';
import { Navbar } from '@/components/Navbar';
import {
  AuthenticateWithDecryptedTokenMessage,
  BadAuthorizationMessage,
  ChangeMessage,
  InitialStateMessage,
  IssueGrantMessage,
  RejectConnectionMessage,
  RequestGrantMessage,
  RequestUpdatedDocumentFromPeerMessage,
  SendEncryptedTokenMessage,
  SendIdentityMessage,
  SendUpdatedDocumentMessage,
} from '@/store/document/connection-protocol';
import { boundMethod } from 'autobind-decorator';
import automerge from 'automerge';
import { createHash } from 'crypto';
import Immutable, { Set } from 'immutable';
import Peer from 'peerjs';
import React, { Component } from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { RouteComponentProps } from 'react-router';
import { Operation, Value } from 'slate';
import Swal from 'sweetalert2';
import Editor from './Editor';
import { mapDispatchToProps, mapStateToProps } from './EditorPageContainer';
import { initialValue as initialValueBob } from './initial-value.bob';
import { initialValue as initialValueAlice } from './initialValue.alice';

const styles = (theme: typeof Theme) => ({
  page: {
    textAlign: 'center',
    backgroundColor: theme.backgroundColor,
    height: '100%',
  },
  editor: {
    height: '100%',
  },
});

interface AppState {
  peers: Set<Peer.DataConnection>;
  connectingPeerID: string;
}

type EditorPageActions = typeof mapDispatchToProps;
type EditorPageStateProps = ReturnType<typeof mapStateToProps>;

export interface EditorPageProps
  extends EditorPageActions,
    EditorPageStateProps,
    WithSheet<typeof styles>,
    RouteComponentProps {}

class EditorPage extends Component<EditorPageProps, AppState> {
  public state: AppState;

  private self!: Peer;

  constructor(props: any) {
    super(props);

    this.state = {
      connectingPeerID: '',
      peers: Set(),
    };
  }

  public componentDidMount(): void {
    const {
      loadDocumentFromSwarm,
      syncDocumentWithCurrentSlateData,
      setDocumentID,
      setSlateRepr,
      rejectConnection,
      role,
    } = this.props;

    const documentID = this.props.history.location.pathname.match(
      /[^/]*$/g,
    )!![0];

    const initialValueJSON =
      role === 'Alice' ? (initialValueAlice as any) : (initialValueBob as any);
    const initialValue = Value.fromJSON(initialValueJSON);

    setSlateRepr(initialValue);
    syncDocumentWithCurrentSlateData();

    if (role === 'Alice') {
      setDocumentID(documentID);
      loadDocumentFromSwarm();
    }

    this.self = new Peer({
      secure: true,
      host: process.env.REACT_APP_PEER_SERVER_HOST,
      port: 443,
      path: '/swag',
    });

    const {
      setPeerID,
      sendAuthenticationTokenToPeer,
      authenticatePeer,
      issueGrant,
    } = this.props;

    this.self.on('open', (peerID) => {
      setPeerID(peerID);
    });
    this.self.on('connection', (conn) => {
      this.setState({
        peers: this.state.peers.add(conn),
      });
      conn.on('error', (msg) => {
        console.error('connection error', msg);
      });
      conn.on('close', () => {
        this.setState({ peers: this.state.peers.remove(conn) });
      });
      conn.on(
        'data',
        async (
          data:
            | ChangeMessage
            | RequestUpdatedDocumentFromPeerMessage
            | SendUpdatedDocumentMessage
            | RequestGrantMessage
            | SendIdentityMessage
            | AuthenticateWithDecryptedTokenMessage,
        ) => {
          switch (data.type) {
            case 'AUTHENTICATE_WITH_DECRYPTED_TOKEN_MESSAGE': {
              authenticatePeer({
                decryptedToken: data.token,
                bobVerifyingKey: data.bobVerifyingKey,
                connection: conn,
              });
              break;
            }
            case 'REQUEST_GRANT_MESSAGE': {
              Swal.fire({
                position: 'top-end',
                type: 'info',
                title: 'Incoming Connection',
                html: `Bob is trying to connect.<br />Verifying Key: <code>${
                  data.bob.verifyingKey
                }</code>`,
                showConfirmButton: true,
                showCancelButton: true,
                backdrop: false,
              }).then((result) => {
                if (result.value) {
                  issueGrant({
                    label: data.label,
                    bobEncryptingKey: data.bob.encryptingKey,
                    bobVerifyingKey: data.bob.verifyingKey,
                    connection: conn,
                  });
                } else {
                  rejectConnection({
                    connection: conn,
                  });
                }
              });
              break;
            }
            case 'SEND_IDENTITY_MESSAGE': {
              sendAuthenticationTokenToPeer({
                bobVerifyingKey: data.bobVerifyingKey,
                connection: conn,
              });
              break;
            }
            case 'CHANGE': {
              const {
                applyRemoteChangeToLocalDocument,
                checkifRemoteSlateHashMatchesAfterChange,
              } = this.props;
              const changeData = JSON.parse(data.changeData);
              applyRemoteChangeToLocalDocument(changeData);
              checkifRemoteSlateHashMatchesAfterChange({
                hash: data.slateHash,
                connection: conn,
              });
              break;
            }
            case 'REQUEST_UPDATED_DOCUMENT_FROM_PEER': {
              const { sendUpdatedDocument } = this.props;
              const currentDoc = this.props.data;

              const changeData = JSON.stringify(
                automerge.getChanges(automerge.init(), currentDoc!!),
              );

              sendUpdatedDocument({
                connection: conn,
                document: changeData,
              });
              break;
            }
            case 'SEND_UPDATED_DOCUMENT_MESSAGE': {
              const currentDoc = this.props.data;
              const { applyRemoteChangeToLocalDocument } = this.props;
              try {
                const doc = JSON.parse(data.document);
                const newDoc = automerge.applyChanges(automerge.init(), doc);
                const newMergedDoc = automerge.merge(currentDoc, newDoc);

                const changes = automerge.getChanges(currentDoc, newMergedDoc);
                if (changes.length > 0) {
                  applyRemoteChangeToLocalDocument(changes);
                }
              } catch (err) {
                console.error(err);
              }
            }
            default:
              break;
          }
        },
      );
    });
  }

  public render(): JSX.Element {
    const { connectingPeerID, peers } = this.state;
    const { classes, slateRepr, isLoading, role, sendIdentity } = this.props;
    return (
      <div className={classes.page}>
        <Navbar />
        {role === 'Bob' && peers.size === 0 && (
          <React.Fragment>
            <input
              onChange={(e) => {
                this.setState({ connectingPeerID: e.target.value });
              }}
            />
            <button onClick={() => this.connectToAlice(connectingPeerID)}>
              Connect
            </button>
          </React.Fragment>
        )}

        <Editor
          isLoading={isLoading}
          className={classes.editor}
          value={slateRepr}
          onChange={({ value, operations }) => {
            return this.onChange({ value, operations });
          }}
          applyInset={true}
        />
      </div>
    );
  }

  public componentDidUpdate(prevProps: EditorPageProps): void {
    const { sendChangesToPeers } = this.props;
    const previousDoc = prevProps.data;
    const currentDoc = this.props.data;
    const { peers } = this.state;

    try {
      const changes = automerge.getChanges(previousDoc, currentDoc);
      if (changes.length > 0) {
        const changeData = JSON.stringify(changes);
        const { slateRepr } = this.props;
        const slateHash = createHash('sha256')
          .update(JSON.stringify(slateRepr.toJSON()))
          .digest('base64');

        sendChangesToPeers({
          peers,
          changeData,
          slateHash,
        });
      }
    } catch (err) {
      if (err instanceof RangeError) {
        return;
      }

      throw err;
    }
  }

  @boundMethod
  private onChange({
    value,
    operations,
  }: {
    operations: Immutable.List<Operation>;
    value: Value;
  }): void {
    const { setSlateRepr, applyLocalChange } = this.props;
    setSlateRepr(value);

    const currentDoc = this.props.data;

    if (!currentDoc) {
      return;
    }

    applyLocalChange(operations);
  }

  @boundMethod
  private connectToAlice(
    connectingPeerID: string,
  ): Promise<Peer.DataConnection> {
    return new Promise<Peer.DataConnection>((res) => {
      const connection = this.self.connect(connectingPeerID);
      connection.on('open', () => {
        const { sendIdentity } = this.props;
        const { peers } = this.state;
        this.setState({
          peers: peers.add(connection),
        });
        sendIdentity({ connection });
        this.addBobHandlersToConnection(connection);
        res(connection);
      });
    });
  }

  @boundMethod
  private addBobHandlersToConnection(connection: Peer.DataConnection): void {
    const {
      requestGrantFromAlice,
      authenticateWithDecryptedAuthenticationToken,
      setDocumentData,
    } = this.props;
    connection.on(
      'data',
      async (
        data:
          | SendEncryptedTokenMessage
          | IssueGrantMessage
          | InitialStateMessage
          | ChangeMessage
          | BadAuthorizationMessage
          | RejectConnectionMessage,
      ) => {
        switch (data.type) {
          case 'REJECT_CONNECTION': {
            Swal.fire({
              type: 'warning',
              title: 'Connection Rejected',
              html: `The host has rejected your connection or the grant has expired`,
              showCancelButton: false,
            });
            connection.close();
            this.setState({
              peers: this.state.peers.remove(connection),
            });
            break;
          }
          case 'BAD_AUTHORIZATION': {
            sessionStorage.removeItem(data.label);
            connection.close();
            this.setState({
              peers: Set(),
            });
            this.connectToAlice(connection.peer);
            break;
          }
          case 'CHANGE': {
            const {
              applyRemoteChangeToLocalDocument,
              checkifRemoteSlateHashMatchesAfterChange,
            } = this.props;
            const changeData = JSON.parse(data.changeData);
            applyRemoteChangeToLocalDocument(changeData);
            checkifRemoteSlateHashMatchesAfterChange({
              hash: data.slateHash,
              connection,
            });
            break;
          }
          case 'INITIAL_STATE_MESSAGE': {
            const doc = JSON.parse(data.initialState);
            const newDoc = automerge.applyChanges(automerge.init(), doc);
            setDocumentData(newDoc);
            break;
          }
          case 'ISSUE_GRANT_MESSAGE': {
            sessionStorage.setItem(data.label, data.policyEncryptingKey);
            sessionStorage.setItem(
              data.policyEncryptingKey,
              data.aliceVerifyingKey,
            );
            connection.on('close', async () =>
              this.connectToAlice(connection.peer),
            );

            connection.close();
            break;
          }
          case 'SEND_ENCRYPTED_TOKEN_MESSAGE': {
            const policyEncryptingKey = sessionStorage.getItem(data.label);
            if (!policyEncryptingKey) {
              requestGrantFromAlice({
                label: data.label,
                connection,
              });
              requestGrantFromAlice({
                label: data.label,
                connection,
              });
              break;
            }
            const aliceVerifyingKey = sessionStorage.getItem(
              policyEncryptingKey,
            )!!;

            authenticateWithDecryptedAuthenticationToken({
              label: data.label,
              encryptedToken: data.token,
              connection,
              policyEncryptingKey,
              aliceVerifyingKey,
            });
            break;
          }
          default:
            break;
        }
      },
    );
  }
}

export default injectSheet(styles)(EditorPage);
