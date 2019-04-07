import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { connect } from 'react-redux';
import NavBar from './Navbar';

export const mapStateToProps = (state: AppState) => ({
  role: state.role.role,
  documentID: state.document.documentID,
  swarmPrivateKey: state.document.swarmPrivateKey,
  authorizedPeers: state.document.authorizedPeers,
});

export const mapDispatchToProps = {
  kickPeer: DocumentActions.kickPeer,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
