import { boundMethod } from 'autobind-decorator';
import automerge from 'automerge';
import Immutable, { Map } from 'immutable';
import Peer from 'peerjs';
import React, { Component } from 'react';
import injectSheet, { ThemeProvider, WithSheet } from 'react-jss';
import { Operation, Value } from 'slate';
import {
  applyAutomergeOperations,
  applySlateOperations,
  automergeJsonToSlate,
  slateCustomToJson,
} from 'slate-automerge';
import { Theme } from './App';
import Editor from './Editor';
import { initialValue as initialValueJSON } from './initialValue';
import Navbar from './Navbar';

const styles = (theTheme: typeof Theme) => ({
  page: {
    textAlign: 'center',
    backgroundColor: theTheme.backgroundColor,
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

interface InitialConnectionMessage {
  type: 'INITIAL_CONNECTION_MESSAGE';
  peerID: string;
}

interface InitialStateMessage {
  type: 'INITIAL_STATE_MESSAGE';
  initialState: string;
}

interface ChangeMessage {
  type: 'CHANGE';
  changeData: string;
}

interface AppState {
  value: Value;
  peers: Map<string, Peer.DataConnection>;
  connectingPeerID: string;
  peerID: string;
}

interface Doc {
  value: any;
}

export interface HomePageProps extends WithSheet<typeof styles> {}

class HomePage extends Component<HomePageProps, AppState> {
  public state: AppState;

  private self!: Peer;

  private docSet!: automerge.DocSet;

  constructor(props: any) {
    super(props);

    this.docSet = new automerge.DocSet();

    this.state = {
      value: initialValue,
      peerID: '',
      connectingPeerID: '',
      peers: Map(),
    };
  }

  public componentDidMount(): void {
    this.self = new Peer({
      secure: true,
      host: process.env.REACT_APP_PEER_SERVER_HOST,
      port: 443,
      path: '/swag',
    });
    this.self.on('open', (peerID) => {
      console.log(peerID);
      this.setState({ peerID });

      const initialDoc = automerge.change(
        automerge.init(),
        'Initialize Slate state',
        (doc: { value: any }) => {
          const { value } = this.state;
          console.log('slate to json', slateCustomToJson(value.document));
          doc.value = slateCustomToJson(value.document);
        },
      );
      this.docSet.setDoc(peerID, initialDoc);
    });
    this.self.on('connection', (conn) => {
      conn.on(
        'data',
        async (
          data: InitialConnectionMessage | ChangeMessage | InitialStateMessage,
        ) => {
          const { peerID } = this.state;
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

              this.docSet.setDoc(peerID, newDoc);

              const updatedSlate = Value.fromJSON(
                automergeJsonToSlate({
                  document: { ...newDoc.value },
                })!!,
              );
              console.log(updatedSlate);
              this.setState({
                value: updatedSlate,
              });
              break;
            }
            case 'CHANGE': {
              const currentDoc = this.docSet.getDoc(peerID);

              const changes = JSON.parse(data.changeData);

              const newDoc = automerge.applyChanges(currentDoc!!, changes);
              const opSetDiff = automerge.diff(currentDoc!!, newDoc);

              if (opSetDiff.length !== 0) {
                let change = (this.state.value as any).change();
                change = applyAutomergeOperations(opSetDiff, change, () => {
                  const doc = this.docSet.getDoc(this.state.peerID);
                  const newJson = automergeJsonToSlate({
                    document: { ...doc!!.value },
                  })!!;
                  this.setState({ value: Value.fromJSON(newJson) });
                });
                if (change) {
                  this.setState({ value: change.value });
                }
              }
              this.docSet.setDoc(peerID, newDoc);
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
    const { classes } = this.props;
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
          value={this.state.value}
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
    this.setState({ value });

    const { peerID } = this.state;
    const currentDoc = this.docSet.getDoc(peerID);

    if (!currentDoc) {
      return;
    }

    console.log(currentDoc);
    applySlateOperations(this.docSet, peerID, operations, '');
    const newDoc = this.docSet.getDoc(peerID)!!;

    const changeData = JSON.stringify(automerge.getChanges(currentDoc, newDoc));

    if (isExtendedDoc(newDoc)) {
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
    } else {
      throw new Error(`doc is not extended doc, ${newDoc}`);
    }
  }

  @boundMethod
  private connectToPeer(connectingPeerID: string): Promise<void> {
    return new Promise<void>((res) => {
      const connection = this.self.connect(connectingPeerID);
      connection.on('open', () => {
        const { peers, peerID } = this.state;

        this.setState({ peers: peers.set(connectingPeerID, connection) });
        const initialConnectionMsg: InitialConnectionMessage = {
          type: 'INITIAL_CONNECTION_MESSAGE',
          peerID,
        };
        connection.send(initialConnectionMsg);
        res();
      });
    });
  }

  private sendInitialState(recipientPeerID: string): void {
    const { peers, peerID } = this.state;
    const currentDoc = this.docSet.getDoc(peerID);
    const connection = peers.get(recipientPeerID);
    const changeData = JSON.stringify(
      automerge.getChanges(automerge.init(), currentDoc!!),
    );
    const initialStateMessage: InitialStateMessage = {
      type: 'INITIAL_STATE_MESSAGE',
      initialState: changeData,
    };

    connection!!.send(initialStateMessage);
  }
}

function isExtendedDoc(doc: any): doc is Doc {
  return doc.value !== undefined;
}

export default injectSheet(styles)(HomePage);
