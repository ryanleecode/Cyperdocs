import { boundMethod } from 'autobind-decorator';
import automerge, { DocSet, getActorId } from 'automerge';
import Immutable, { Map, Set } from 'immutable';
import Peer from 'peerjs';
import { any } from 'prop-types';
import React, { Component } from 'react';
import { Block, Document, Operation, Value } from 'slate';
import {
  SerializedBlock,
  SerializedDocument,
  SerializedInline,
  serializeDocument,
  SerializedText,
} from 'slate-automerge';
import { Editor } from 'slate-react';
import './App.css';
import initialValueJSON from './initialValue.json';
import logo from './logo.svg';

const initialValue = Value.fromJSON(initialValueJSON as any);

interface InitialConnectionMessage {
  type: 'INITIAL_CONNECTION_MESSAGE';
  peerID: string;
}

interface AppState {
  value: Value;
  peers: Set<string>;
  connectingPeerID: string;
  peerID: string;
}

class App extends Component<{}, AppState> {
  public state: AppState;

  private self!: Peer;

  private docSet!: DocSet;

  private connection!: automerge.Connection;

  constructor(props: any) {
    super(props);

    this.state = {
      value: initialValue,
      peerID: '',
      connectingPeerID: '',
      peers: Set([]),
    };
  }

  public componentDidMount(): void {
    this.docSet = new automerge.DocSet();

    this.self = new Peer({
      secure: true,
      host: 'a26d3ebb.ngrok.io',
      port: 443,
      path: '/swag',
    });
    const initialDoc = automerge.init();
    this.self.on('open', (peerID) => {
      console.log(peerID);
      this.docSet.setDoc(peerID, initialDoc);
      this.connection = new automerge.Connection(this.docSet, (msg: any) => {
        console.log('automerge connection receiving a msg', msg);
        const { peers } = this.state;

        peers.forEach((peer) => {
          const intermediaryConnection = this.self.connect(peer!);
          intermediaryConnection.on('open', () => {
            intermediaryConnection.send(msg);
          });
        });

        this.connection.open();
      });
      this.setState({ peerID });
      const doc = this.docSet.getDoc(peerID);
      const newDoc = automerge.change(
        doc,
        'Initialize',
        (oldDoc: { [key: string]: any }) => {
          oldDoc.value = serializeDocument(initialValue.document);
        },
      );
      this.docSet.setDoc(peerID, newDoc);
    });
    this.self.on('connection', (conn) => {
      conn.on('data', (data: InitialConnectionMessage) => {
        switch (data.type) {
          case 'INITIAL_CONNECTION_MESSAGE':
            const { peers } = this.state;
            if (!peers.contains(data.peerID)) {
              this.connectToPeer(data.peerID);
            }
            break;
          default:
            break;
        }
        // Will print 'hi!'
        console.log('Incoming Transmission!', data);
      });
    });
  }

  public render(): JSX.Element {
    const { connectingPeerID } = this.state;
    return (
      <div className="App">
        <input
          onChange={(e) => {
            this.setState({ connectingPeerID: e.target.value });
          }}
        />
        <button onClick={() => this.connectToPeer(connectingPeerID)}>
          Call
        </button>
        <Editor value={this.state.value} onChange={this.onChange} />
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
  }) {
    this.setState({ value });

    const { peerID } = this.state;
    const currentDoc = this.docSet.getDoc(peerID);

    const newDoc = automerge.change(currentDoc, 'apply changes', (doc: any) => {
      operations.forEach((operation) => {
        if (!operation) {
          return;
        }

        const rootNode: SerializedDocument = doc.value;

        switch (operation.type) {
          case 'insert_text':
            const { path, offset, text } = operation;
            let currentNode:
              | SerializedDocument
              | SerializedBlock
              | SerializedInline
              | SerializedText = rootNode;
            path.forEach((el) => {
              if (!this.isLeafNode(currentNode)) {
                currentNode = currentNode.nodes[el];
              }
            });
            if (this.isLeafNode(currentNode)) {
              const firstLeaf = currentNode.leaves[0];
              firstLeaf.text.insertAt(offset, text);
            }
            break;
          default:
            break;
        }
      });
    });
    this.docSet.setDoc(peerID, newDoc);

    this.connection.sendMsg(peerID, Map<any, any>(), newDoc);
  }

  @boundMethod
  private connectToPeer(connectingPeerID: string): void {
    const connection = this.self.connect(connectingPeerID);
    connection.on('open', () => {
      const { peers, peerID } = this.state;
      this.setState({ peers: peers.add(connectingPeerID) });
      const initialConnectionMsg: InitialConnectionMessage = {
        type: 'INITIAL_CONNECTION_MESSAGE',
        peerID,
      };
      connection.send(initialConnectionMsg);
    });
  }

  private isLeafNode(
    node:
      | SerializedDocument
      | SerializedBlock
      | SerializedInline
      | SerializedText,
  ): node is SerializedText {
    return (
      (node as SerializedDocument | SerializedBlock | SerializedInline)
        .nodes === undefined
    );
  }
}

export default App;
