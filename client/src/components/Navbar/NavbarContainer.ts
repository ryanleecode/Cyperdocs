import { AppState } from '@/store';
import { connect } from 'react-redux';
import NavBar from './Navbar';

const mapStateToProps = (state: AppState) => ({
  role: state.role.role,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NavBar);
