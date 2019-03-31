import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { connect } from 'react-redux';
import AlicePage from './AlicePage';

const mapStateToProps = (state: AppState) => ({
  documentIdentifier: state.document.documentID,
  aliceBaseURL: state.document.aliceBaseURL,
  policyEncryptingKey: state.document.policyEncryptingKey,
  enricoBaseURL: state.document.enricoBaseURL,
  fakeBobBaseURL: state.document.fakeBobBaseURL,
  swarmPrivateKey: state.document.swarmPrivateKey,
});

const mapDispatchToProps = {
  setAliceBaseURL: DocumentActions.setAliceBaseURL,
  setDocumentID: DocumentActions.setDocumentID,
  setEnricoBaseURL: DocumentActions.setEnricoBaseURL,
  setSwarmPrivateKey: DocumentActions.setSwarmPrivateKey,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AlicePage);
