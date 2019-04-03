import { Theme } from '@/App';
import Navbar from '@/components/Navbar';
import {
  SendInitialDocumentStateToIncomingPeerPayload,
  SendPeerIDToConnectingPeerPayload,
} from '@/store/document/actions';
import {
  InitialConnectionMessage,
  InitialStateMessage,
} from '@/store/document/connection-protocol';
import { SwarmClient } from '@erebos/swarm';
import { boundMethod } from 'autobind-decorator';
import automerge from 'automerge';
import { Doc as AutomergeDocument } from 'automerge';
import Immutable, { Map } from 'immutable';
import Peer from 'peerjs';
import React, { Component } from 'react';
import injectSheet, { WithSheet } from 'react-jss';
import { RouteComponentProps } from 'react-router';
import { Operation, Value } from 'slate';
import { Document } from 'slate';
import {
  applyAutomergeOperations,
  applySlateOperations,
  automergeJsonToSlate,
  slateCustomToJson,
} from 'slate-automerge';
import Editor from './Editor';
import { initialValue as initialValueJSON } from './initialValue';

const BZZ_URL = 'https://swarm-gateways.net';

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

const initialValue = Value.fromJSON(initialValueJSON as any);

let dumb = automerge.init();
const initialSlateValue = initialValue;
dumb = automerge.change(dumb, 'Initialize Slate state', (doc: any) => {
  doc.note = slateCustomToJson(initialSlateValue.document);
});

interface ChangeMessage {
  type: 'CHANGE';
  changeData: string;
}

interface AppState {
  peers: Map<string, Peer.DataConnection>;
  connectingPeerID: string;
}

interface Doc {
  value: any;
}

export interface EditorPageProps
  extends WithSheet<typeof styles>,
    RouteComponentProps {
  swarmPrivateKey: string;
  data: AutomergeDocument;
  slateRepr: Value;
  peerID: string;
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
    } = this.props;

    const documentID = this.props.history.location.pathname.match(
      /[^/]*$/g,
    )!![0];

    setSlateRepr(initialValue);
    syncDocumentWithCurrentSlateData();
    setDocumentID(documentID);
    loadDocumentFromSwarm();

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
          data: InitialConnectionMessage | ChangeMessage | InitialStateMessage,
        ) => {
          switch (data.type) {
            case 'INITIAL_CONNECTION_MESSAGE': {
              const { peers } = this.state;
              if (!peers.has(data.peerID)) {
                await this.connectToPeer(data.peerID);
                this.sendInitialState(data.peerID);
              }
              break;
            }
            case 'INITIAL_STATE_MESSAGE': {
              const doc = JSON.parse(data.initialState);
              const newDoc = automerge.applyChanges(automerge.init(), doc);
              setDocumentData(newDoc);

              const updatedSlate = Value.fromJSON(
                automergeJsonToSlate(newDoc.value)!!,
              );
              setSlateRepr(updatedSlate);
              break;
            }
            case 'CHANGE': {
              const currentDoc = this.props.data;

              const changes = JSON.parse(data.changeData);

              const newDoc = automerge.applyChanges(currentDoc!!, changes);
              const opSetDiff = automerge.diff(currentDoc!!, newDoc);

              if (opSetDiff.length !== 0) {
                const { slateRepr } = this.props;
                let change = (slateRepr as any).change();
                change = applyAutomergeOperations(opSetDiff, change, () => {
                  const doc = this.props.data;
                  const newJson = automergeJsonToSlate({
                    document: { ...doc!!.value },
                  })!!;
                  setSlateRepr(Value.fromJSON(newJson));
                });
                if (change) {
                  setSlateRepr(change.value);
                }
              }

              setDocumentData(newDoc);
              break;
            }
            default:
              break;
          }
        },
      );
    });
  }

  public render(): JSX.Element {
    const { connectingPeerID } = this.state;
    const { classes, slateRepr } = this.props;
    return (
      <div className={classes.page}>
        <Navbar />
        <input
          onChange={(e) => {
            this.setState({ connectingPeerID: e.target.value });
          }}
        />
        <button onClick={() => this.connectToPeer(connectingPeerID)}>
          Call
        </button>
        <Editor
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
    const newDoc = this.props.data;

    const changeData = JSON.stringify(automerge.getChanges(currentDoc, newDoc));

    if (isDocumentLoaded(newDoc)) {
      const { peers } = this.state;

      peers.keySeq().forEach((peer) => {
        const intermediaryConnection = this.self.connect(peer!);
        intermediaryConnection.on('open', () => {
          const changeMessage: ChangeMessage = {
            type: 'CHANGE',
            changeData,
          };
          intermediaryConnection.send(changeMessage);
        });
      });
    }
  }

  @boundMethod
  private connectToPeer(connectingPeerID: string): Promise<void> {
    return new Promise<void>((res) => {
      const connection = this.self.connect(connectingPeerID);
      connection.on('open', () => {
        const { peerID, sendPeerIDToConnectingPeer } = this.props;
        const { peers } = this.state;
        this.setState({ peers: peers.set(connectingPeerID, connection) });
        sendPeerIDToConnectingPeer({ connection, peerID });
        res();
      });
    });
  }

  private sendInitialState(recipientPeerID: string): void {
    const { data: currentDoc, sendInitialStateToIncomingPeer } = this.props;
    const { peers } = this.state;
    const connection = peers.get(recipientPeerID);
    const changeData = JSON.stringify(
      automerge.getChanges(automerge.init(), currentDoc!!),
    );

    sendInitialStateToIncomingPeer({
      connection,
      serializedChanges: changeData,
    });
  }
}

function isDocumentLoaded(doc: any): doc is Doc {
  return doc.value !== undefined;
}

export default injectSheet(styles)(EditorPage);