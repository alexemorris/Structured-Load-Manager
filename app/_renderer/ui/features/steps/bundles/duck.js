import createDuck from '../../tree/createDuck';

export const REQUEST_BUNDLE = 'ebundleAuthor/steps/bundles/REQUEST_BUNDLE';
export const RESPOND_BUNDLE = 'ebundleAuthor/steps/bundles/RESPOND_BUNDLE';
export const REQUEST_VALUES = 'ebundleAuthor/steps/bundles/REQUEST_VALUES';
export const RESPOND_VALUES = 'ebundleAuthor/steps/bundles/RESPOND_VALUES';


const blankSettingsObject = {
  description: '',
  bundles: [],
  id: '',
  filterColumn: null,
  filterValue: null,
  expanded: true
};

const duck = createDuck({ store: 'bundles', blankSettingsObject, type: 'Bundle' });

// export const categoricalValues = createSelector(
//   [columnValues], (c) => (
//     c.filter(x => x.type === 'categorical').map(col => (
//       {
//         value: col.name,
//         label: col.name,
//         values: [...new Set(col.values)]
//       }
//     ))
//   )
// );
//
// const selection = state => state.selection.previewBundle;
// const bundles = state => state.bundles;
// const entries = state => state.metadata.entries;
//
// const bundleFiltered = createSelector(
//   [selection, bundles, entries], (s, b, e) => (
//     s.reduce((acc, curr) => {
//       console.log(s);
//       console.log(curr);
//       console.log(acc);
//       const current = acc[0].filter(x => x.uuid === curr)[0];
//       return [current.nodes, [...acc[1], { fc: current.settings.filterColumn, fv: current.settings.filterValue }]];
//     }, [b, []])[1].reduce((acc, curr) => {
//       return acc.filter(x => x[curr.fc] === curr.fv);
//     }, e)
//   )
// );

// export const bundlesValues = allValuesSelector(bundleFiltered);

export default duck;
