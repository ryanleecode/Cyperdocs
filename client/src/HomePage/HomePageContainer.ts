import { AppState } from '@/store';
import { actions as RoleActions } from '@/store/role';
import { connect } from 'react-redux';
import HomePage from './HomePage';

const mapStateToProps = (state: AppState) => ({});

const mapDispatchToProps = {
  setRole: RoleActions.setRole,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HomePage);
