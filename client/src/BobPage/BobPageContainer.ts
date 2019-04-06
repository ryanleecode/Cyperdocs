import { AppState } from '@/store';
import { actions as DocumentActions } from '@/store/document';
import { actions as RoleActions } from '@/store/role';
import { connect } from 'react-redux';
import BobPage from './BobPage';

const mapStateToProps = (state: AppState) => ({
  bobBaseURL: state.document.bobBaseURL,
});

const mapDispatchToProps = {
  setBobBaseURL: DocumentActions.setBobBaseURL,
  setRole: RoleActions.setRole,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BobPage);
