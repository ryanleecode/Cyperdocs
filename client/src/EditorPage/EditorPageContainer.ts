import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { connect } from 'react-redux';
import EditorPage from './EditorPage';

const mapStateToProps = (state: AppState) => ({
  swarmPrivateKey: state.document.swarmPrivateKey,
  data: state.document.data,
  slateRepr: state.document.slateRepr,
  peerID: state.document.peerID,
  isLoading: state.document.isLoading,
});

const mapDispatchToProps = {
  loadDocumentFromSwarm: DocumentActions.loadDocumentFromSwarm,
  setDocumentID: DocumentActions.setDocumentID,
  syncDocumentWithCurrentSlateData:
    DocumentActions.syncDocumentWithCurrentSlateData,
  applyLocalChange: DocumentActions.applyLocalChange,
  setSlateRepr: DocumentActions.setSlateRepr,
  setPeerID: DocumentActions.setPeerID,
  setDocumentData: DocumentActions.setDocumentData,
  sendPeerIDToConnectingPeer: DocumentActions.sendPeerIDToConnectingPeer,
  sendInitialStateToIncomingPeer:
    DocumentActions.sendInitialDocumentStateToIncomingPeer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorPage);
