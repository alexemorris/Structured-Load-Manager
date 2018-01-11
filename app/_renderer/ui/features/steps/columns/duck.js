
import createDuck from '../../tree/createDuck';


export const REQUEST_COLUMN = 'ebundleAuthor/steps/columns/REQUEST_COLUMN';
export const RESPOND_COLUMN = 'ebundleAuthor/steps/columns/RESPOND_COLUMN';
export const AUTOMAP_COLUMNS = 'ebundleAuthor/steps/columns/AUTOMAP_COLUMN';
export const SET_COLUMNS = 'ebundleAuthor/steps/columns/SET_COLUMNS';
export const SAVE_MAPPED_COLUMNS = 'ebundleAuthor/steps/columns/SAVE_MAPPED_COLUMNS';

export const blankSettingsObject = {
  visible: true,
  indexed: true,
  template: '',
  type: '',
  direct: '',
  dateFormat: '',
  mapping: 'direct',
  width: 200,
  autoWidth: false,
  script: ''
};

const duck = createDuck({ store: 'columns', blankSettingsObject, type: 'Column' }).extend({
  creators: () => ({
    setColumns: (columns) => ({ type: SET_COLUMNS, payload: columns }),
  }),
  reducer: (state, action) => {
    switch (action.type) {
      case SET_COLUMNS:
        return action.payload;
      default:
        return state;
    }
  }
});
//
//
// const columns = state => state.columns;
//
// const currentColumn = state => {
//   const current = state.columns.filter(x => x.uuid === state.selection.previewColumn);
//   if (current.length) {
//     return current[0].settings;
//   }
//   return null;
// };
//
// const init = `
//   const moment = this.moment;
//   const _ = this._
// `;
//
// export const allValuesSelector = (rows) => createSelector(
//   [columns, rows], (c, e) => c.map(col => {
//     const typed = parseValues(col.settings, e);
//     let uuidType = false;
//     const type = col.settings.type;
//     if (type === 'number' || type === 'string' || type === 'fixed') {
//       uuidType = [...new Set(typed)].length === typed.length;
//     }
//     return { ...col, typed, uuidType };
//   })
// );
//
// export const columnValues = allValuesSelector(entries);
//
// export const parsedEntries = createSelector(
//   [columnValues], (v) => (
//     v[0].typed.map((x, idx) =>
//      v.reduce((acc, curr) =>
//        ({ ...acc, [curr.uuid]: curr.typed[idx] }), {}
//      )
//    )
//   )
// );
//
// export const currentColumnParsed = createSelector(
//   [currentColumn, entries], (c, e) => (c ? { ...c, typed: parseValues(c, e) } : null)
// );

export default duck;
