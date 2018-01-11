import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import duck from './duck';
import * as selection from '../../shared/selection/duck';
import ColumnStep from './_ColumnStep';


function mapStateToProps(state) {
  return {
    nodes: state.columns,
    header: state.metadata.header,
    active: state.selection.previewColumn
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...duck.creators, selectNode: selection.setPreviewColumn }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnStep);
