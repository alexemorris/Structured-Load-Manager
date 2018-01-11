import { combineReducers } from 'redux';
import metadata from '../features/steps/metadata/duck';
import files from '../features/steps/files/duck';
import timeline from '../features/timeline/duck';
import mapping from '../features/steps/mapping/duck';
import bundles from '../features/steps/bundles/duck';
import columns from '../features/steps/columns/duck';
import selection from '../features/shared/selection/duck';
import packaging from '../features/steps/packaging/duck';
import search from '../features/steps/search/duck';

export default combineReducers({
  metadata,
  timeline,
  mapping,
  files,
  selection,
  packaging,
  search,
  bundles: bundles.reducer,
  columns: columns.reducer
});
