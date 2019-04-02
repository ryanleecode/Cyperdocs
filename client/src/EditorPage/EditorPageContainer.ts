import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { connect } from 'react-redux';
import EditorPage from './EditorPage';

const mapStateToProps = (state: AppState) => ({
  swarmPrivateKey: state.document.swarmPrivateKey,
});

const mapDispatchToProps = {
  loadDocumentFromSwarm: DocumentActions.loadDocumentFromSwarm,
  setDocumentID: DocumentActions.setDocumentID,
  fillDocumentWithDefaultData: DocumentActions.fillDocumentWithDefaultData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditorPage);
