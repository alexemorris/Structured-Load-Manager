import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as duck from './duck';
import columnDuck from '../columns/duck';

import SearchStep from './_SearchStep';

function mapStateToProps(state) {
  return {
    ...state.search,
    results: state.search.results,
    mapping: state.mapping,
    columns: state.columns
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ ...duck, changeNodeSettings: columnDuck.creators.changeNodeSettings }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchStep);
