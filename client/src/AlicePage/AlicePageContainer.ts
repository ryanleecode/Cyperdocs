import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { actions as RoleActions } from '@/store/role';
import { connect } from 'react-redux';
import AlicePage from './AlicePage';

export const mapStateToProps = (state: AppState) => ({
  documentIdentifier: state.document.documentID,
  aliceBaseURL: state.document.aliceBaseURL,
  policyEncryptingKey: state.document.policyEncryptingKey,
  enricoBaseURL: state.document.enricoBaseURL,
  fakeBobBaseURL: state.document.fakeBobBaseURL,
  swarmPrivateKey: state.document.swarmPrivateKey,
});

export const mapDispatchToProps = {
  setAliceBaseURL: DocumentActions.setAliceBaseURL,
  setDocumentID: DocumentActions.setDocumentID,
  setEnricoBaseURL: DocumentActions.setEnricoBaseURL,
  setSwarmPrivateKey: DocumentActions.setSwarmPrivateKey,
  setFakeBobBaseURL: DocumentActions.setFakeBobBaseURL,
  setRole: RoleActions.setRole,
  createNewDocument: DocumentActions.createNewDocument,
  initializeSwarmDocumnentWithDefaultValues:
    DocumentActions.initializeSwarmDocumnentWithDefaultValues,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlicePage);
