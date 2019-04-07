import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { connect } from 'react-redux';
import EditorPage from './EditorPage';

export const mapStateToProps = (state: AppState) => ({
  swarmPrivateKey: state.document.swarmPrivateKey,
  data: state.document.data,
  slateRepr: state.document.slateRepr,
  peerID: state.document.peerID,
  isLoading: state.document.isLoading,
  role: state.role.role,
  label: state.document.documentID,
  authorizedPeers: state.document.authorizedPeers,
});

export const mapDispatchToProps = {
  loadDocumentFromSwarm: DocumentActions.loadDocumentFromSwarm,
  setDocumentID: DocumentActions.setDocumentID,
  syncDocumentWithCurrentSlateData:
    DocumentActions.syncDocumentWithCurrentSlateData,
  applyLocalChange: DocumentActions.applyLocalChange,
  setSlateRepr: DocumentActions.setSlateRepr,
  setPeerID: DocumentActions.setPeerID,
  setDocumentData: DocumentActions.setDocumentData,
  sendPeerIDToConnectingPeer: DocumentActions.sendPeerIDToConnectingPeer,
  applyRemoteChangeToLocalDocument: DocumentActions.applyRemoteChangeToDocument,
  checkifRemoteSlateHashMatchesAfterChange:
    DocumentActions.checkifRemoteSlateHashMatchesAfterChange,
  sendUpdatedDocument: DocumentActions.sendUpdatedDocument,
  sendAuthenticationTokenToPeer: DocumentActions.sendAuthenticationTokenToPeer,
  requestGrantFromAlice: DocumentActions.requestGrantFromAlice,
  issueGrant: DocumentActions.issueGrant,
  sendIdentity: DocumentActions.sendIdentity,
  authenticateWithDecryptedAuthenticationToken:
    DocumentActions.authenticateWithDecryptedAuthenticationToken,
  authenticatePeer: DocumentActions.authenticatePeer,
  sendChangesToPeers: DocumentActions.sendChangesToPeers,
  rejectConnection: DocumentActions.rejectConnection,
  removeAuthorizedPeer: DocumentActions.removeAuthorizedPeer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorPage);
