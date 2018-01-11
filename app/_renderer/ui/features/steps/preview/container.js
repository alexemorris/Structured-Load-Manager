import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as selection from '../../shared/selection/duck';
import columnDuck from '../columns/duck';
import PreviewStep from './_PreviewStep';
import { REQUEST_TABLE, RESPOND_TABLE } from './duck';

function mapStateToProps(state) {
  return {
    columns: state.columns.filter(x => x.settings.visible),
    widths: state.columns.filter(x => x.settings.visible).reduce(
      (acc, curr) => (
        {
          ...acc,
          [curr.uuid]: curr.settings.width
        }
      ), {}
    ),
    responseChannel: RESPOND_TABLE,
    requestChannel: REQUEST_TABLE
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectEntry: selection.setPreviewEntry,
    changeNodeSettings: columnDuck.creators.changeNodeSettings }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PreviewStep);
