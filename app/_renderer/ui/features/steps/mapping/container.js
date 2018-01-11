import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { setMapping } from './duck';
import MappingStep from './_MappingStep';

function mapStateToProps(state) {
  return {
    columns: state.columns.map(x => ({ value: x.uuid, label: x.name })),
    dateColumns: state.columns.filter(x =>
      x.settings.type === 'date').map(x => ({ value: x.uuid, label: x.name })),
    uuidColumns: state.columns.map(x => ({ value: x.uuid, label: x.name })),
    boolColumns: state.columns.filter(x =>
      x.settings.type === 'bool').map(x => ({ value: x.uuid, label: x.name })),
    mapping: state.mapping
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setMapping }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MappingStep);
