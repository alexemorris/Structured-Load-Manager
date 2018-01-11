import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as duck from './duck';
import * as actionDuck from '../mapping/duck';
import MetadataStep from './_MetadataStep';

const { uuidCols, entries, ...actions } = duck;

function mapStateToProps(state) {
  const output = {
    ...state.metadata,
  };
  return output;
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...actions, ...actionDuck }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MetadataStep);
