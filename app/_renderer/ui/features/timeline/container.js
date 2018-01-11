import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as duck from './duck';
import Timeline from './_Timeline';


function mapStateToProps(state) {
  return duck.selector(state).timeline;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(duck, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Timeline);
