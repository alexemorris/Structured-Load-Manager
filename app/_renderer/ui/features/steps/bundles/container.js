import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import duck, {
  REQUEST_BUNDLE,
  RESPOND_BUNDLE,
  RESPOND_VALUES,
  REQUEST_VALUES
} from './duck';

import * as selection from '../../shared/selection/duck';
import BundleStep from './_BundleStep';


function mapStateToProps(state) {
  return {
    nodes: state.bundles,
    columns: state.columns,
    header: state.metadata.header,
    currentBundle: state.selection.previewBundle,
    currentColumn: state.selection.previewColumn || state.mapping.title,
    requestChannel: REQUEST_BUNDLE,
    responseChannel: RESPOND_BUNDLE,
    requestValues: REQUEST_VALUES,
    respondValues: RESPOND_VALUES
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...duck.creators,
    selectNode: selection.setPreviewBundle,
    selectColumn: selection.setPreviewColumn
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BundleStep);
