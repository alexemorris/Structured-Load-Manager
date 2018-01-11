import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as duck from './duck';
import * as mapping from '../mapping/duck';

import FilesStep from './_CheckFiles';

function mapStateToProps(state) {
  return {
    mappings: state.mapping,
    files: state.files
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...duck, ...mapping }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilesStep);
