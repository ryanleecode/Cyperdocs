import { Theme } from '@/App';
import { Navbar } from '@/components/Navbar';
import {
  CheckIfRemoteSlateHashMatchesAfterChangePayload,
  SendInitialDocumentStateToIncomingPeerPayload,
  SendPeerIDToConnectingPeerPayload,
  SendUpdatedDocumentPayload,
} from '@/store/document/actions';
import {
  InitialConnectionMessage,
  InitialStateMessage,
  RequestUpdatedDocumentFromPeerMessage,
  SendUpdatedDocumentMessage,
} from '@/store/document/connection-protocol';
import { Role } from '@/store/role/types';
import { boundMethod } from 'autobind-decorator';
import automerge from 'automerge';
import { Doc as AutomergeDocument } from 'automerge';
import { createHash } from 'crypto';
import Immutable, { Map } from 'immutable';
import Peer from 'peerjs';
import React, { Component } from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { RouteComponentProps } from 'react-router';
import { Operation, Value } from 'slate';
import Editor from './Editor';
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

interface ChangeMessage {
  type: 'CHANGE';
  changeData: string;
  originPeerID: string;
  slateHash: string;
}

interface PeerConnectionData {
  isAuthorized: boolean;
  connection: Peer.DataConnection;
}

interface AppState {
  peers: Map<string, PeerConnectionData>;
  connectingPeerID: string;
}

export interface EditorPageProps
  extends WithSheet<typeof styles>,
    RouteComponentProps {
  swarmPrivateKey: string;
  data: AutomergeDocument;
  slateRepr: Value;
  isLoading: boolean;
  peerID: string;
  role: Role;
  setDocumentID: (documentID: string) => void;
  loadDocumentFromSwarm: () => void;
  syncDocumentWithCurrentSlateData: () => void;
  applyLocalChange: (operations: Immutable.List<Operation>) => void;
  setSlateRepr: (value: Value) => void;
  setPeerID: (peerID: string) => void;
  setDocumentData: (doc: automerge.Doc) => void;
  sendPeerIDToConnectingPeer: (
    payload: SendPeerIDToConnectingPeerPayload,
  ) => void;
  sendInitialStateToIncomingPeer: (
    payload: SendInitialDocumentStateToIncomingPeerPayload,
  ) => void;
  applyRemoteChangeToLocalDocument: (payload: { [key: string]: any }) => void;
  checkifRemoteSlateHashMatchesAfterChange: (
    payload: CheckIfRemoteSlateHashMatchesAfterChangePayload,
  ) => void;
  sendUpdatedDocument: (payload: SendUpdatedDocumentPayload) => void;
}

class EditorPage extends Component<EditorPageProps, AppState> {
  public state: AppState;

  private self!: Peer;

  constructor(props: any) {
    super(props);

    this.state = {
      connectingPeerID: '',
      peers: Map(),
    };
  }

  public componentDidMount(): void {
    const {
      loadDocumentFromSwarm,
      syncDocumentWithCurrentSlateData,
      setDocumentID,
      setSlateRepr,
      setDocumentData,
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

    this.self.on('open', (peerID) => {
      console.log(peerID);
      const { setPeerID } = this.props;
      setPeerID(peerID);
    });
    this.self.on('connection', (conn) => {
      conn.on(
        'data',
        async (
          data:
            | InitialConnectionMessage
            | ChangeMessage
            | InitialStateMessage
            | RequestUpdatedDocumentFromPeerMessage
            | SendUpdatedDocumentMessage,
        ) => {
          switch (data.type) {
            case 'INITIAL_CONNECTION_MESSAGE': {
              const { peers } = this.state;
              if (!peers.has(data.peerID)) {
                await this.connectToPeer(data.peerID);
                // this.sendInitialState(data.peerID);
              }
              break;
            }
            case 'INITIAL_STATE_MESSAGE': {
              const doc = JSON.parse(data.initialState);
              const newDoc = automerge.applyChanges(automerge.init(), doc);
              setDocumentData(newDoc);
              break;
            }
            case 'CHANGE': {
              const {
                applyRemoteChangeToLocalDocument,
                checkifRemoteSlateHashMatchesAfterChange,
              } = this.props;
              const connectionData = this.state.peers.get(data.originPeerID);
              if (!connectionData.isAuthorized) {
                break;
              }
              const changeData = JSON.parse(data.changeData);
              applyRemoteChangeToLocalDocument(changeData);
              checkifRemoteSlateHashMatchesAfterChange({
                hash: data.slateHash,
                connection: connectionData.connection,
              });
              break;
            }
            case 'REQUEST_UPDATED_DOCUMENT_FROM_PEER': {
              const requestingPeerConnectionData = this.state.peers.get(
                data.originPeerID,
              );

              if (!requestingPeerConnectionData.isAuthorized) {
                break;
              }

              const { sendUpdatedDocument } = this.props;
              const currentDoc = this.props.data;

              const changeData = JSON.stringify(
                automerge.getChanges(automerge.init(), currentDoc!!),
              );

              sendUpdatedDocument({
                connection: requestingPeerConnectionData.connection,
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
                console.log(err);
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
    const { classes, slateRepr, isLoading, role } = this.props;
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
            <button onClick={() => this.connectToPeer(connectingPeerID)}>
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
    const previousDoc = prevProps.data;
    const currentDoc = this.props.data;

    try {
      const changes = automerge.getChanges(previousDoc, currentDoc);
      if (changes.length > 0) {
        const changeData = JSON.stringify(changes);
        const { peers } = this.state;
        const { slateRepr, peerID: myPeerID } = this.props;
        const slateHash = createHash('sha256')
          .update(JSON.stringify(slateRepr.toJSON()))
          .digest('base64');

        peers.keySeq().forEach((peerID) => {
          const connectionData = peers.get(peerID!);
          if (!connectionData.isAuthorized) {
            return;
          }
          const changeMessage: ChangeMessage = {
            type: 'CHANGE',
            originPeerID: myPeerID,
            changeData,
            slateHash,
          };
          connectionData.connection.send(changeMessage);
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
  private connectToPeer(connectingPeerID: string): Promise<void> {
    return new Promise<void>((res) => {
      const connection = this.self.connect(connectingPeerID);
      connection.on('open', () => {
        const { peerID, sendPeerIDToConnectingPeer, role } = this.props;
        const { peers } = this.state;
        this.setState({
          peers: peers.set(connectingPeerID, {
            connection,
            isAuthorized: role === 'Alice',
          }),
        });
        sendPeerIDToConnectingPeer({ connection, peerID });
        res();
      });
    });
  }

  private sendInitialState(recipientPeerID: string): void {
    const { data: currentDoc, sendInitialStateToIncomingPeer } = this.props;
    const { peers } = this.state;
    const connectionData = peers.get(recipientPeerID);
    const changeData = JSON.stringify(
      automerge.getChanges(automerge.init(), currentDoc!!),
    );

    if (!connectionData.isAuthorized) {
      return;
    }

    sendInitialStateToIncomingPeer({
      connection: connectionData.connection,
      serializedChanges: changeData,
    });
  }
}

export default injectSheet(styles)(EditorPage);
