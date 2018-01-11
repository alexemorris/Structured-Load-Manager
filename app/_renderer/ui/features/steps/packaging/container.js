import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startPackaging, setPackagingSetting } from './duck';

import PackageStep from './_PackageStep';

function mapStateToProps(state) {
  return state.packaging;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ startPackaging, setPackagingSetting }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PackageStep);
