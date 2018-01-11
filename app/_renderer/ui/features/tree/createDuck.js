import Duck from 'extensible-duck';
import uuidv1 from 'uuid';

export const blankNode = (values, parents, blankSettingsObject = {}, type = 'Node') => {

  const bundleBaseName = parents.length ? `__ ${type}`.replace('__', parents.map(_ => 'Sub').join(' ')) : `New ${type}`;
  let index = 1;
  let bundleName = `${bundleBaseName} ${index}`;

  while (values.includes(bundleName)) {
    index += 1;
    bundleName = `${bundleBaseName} ${index}`;
  }

  return ({
    uuid: uuidv1(),
    nodes: [],
    expanded: true,
    settingsExpanded: false,
    name: bundleName,
    id: index,
    settings: blankSettingsObject
  });
};

export default ({ store, blankSettingsObject, type }) => {

  const arrayMove = (array, oldIndex, newIndex) => {
    const arr = array.slice(0);
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
  };


  const recurseNodes = (state, parents, callback) => (
      parents.length ? state.map((node) => (
        node.uuid === parents[0] ?
        { ...node,
          nodes: recurseNodes(
            node.nodes,
            parents.slice(1),
            callback
          )
        } : node
      )
    ) : callback(state)
  );

  const newNode = (state, parents, settings, name, id) => (
    recurseNodes(
      state,
      parents,
      (nodes) => {
        let blank = blankNode(nodes.map(x => x.name), parents, blankSettingsObject, type);
        blank = {
          ...blank,
          name: name || blank.name,
          id: id || blank.id,
          settings: {
            ...blank.settings,
            ...settings
          }
        };
        return [...nodes, blank];
      })
  );

  const removeNode = (state, parents, uuid) => (
    recurseNodes(state, parents, (b) => b.filter(x => x.uuid !== uuid))
  );

  const reorderNode = (state, parents, oldIndex, newIndex) => (
    recurseNodes(state, parents, (b) => arrayMove(b, oldIndex, newIndex))
  );

  const changeNode = (state, parents, uuid, key, value) => (
    recurseNodes(state, parents, (b) => b.map(x => (x.uuid === uuid ? { ...x, [key]: value } : x)))
  );

  const changeNodeSettings = (state, parents, uuid, values) => (
    recurseNodes(state, parents, (b) => b.map(x => (x.uuid === uuid ? { ...x, settings: { ...x.settings, ...values } } : x)))
  );

  const output = new Duck({
    namespace: 'ebundleAuthor',
    store,
    types: ['ADD_NODE', 'REMOVE_NODE', 'REORDER_NODE', 'SET_NODES', 'CHANGE_NODE', 'CHANGE_NODE_SETTINGS', 'CLEAR_TREE'],
    initialState: [],
    reducer: (state, action, duck) => {
      switch (action.type) {
        case duck.types.ADD_NODE:
          return newNode(state, action.payload.parents, action.payload.settings, action.payload.name, action.payload.id);
        case duck.types.REMOVE_NODE:
          return removeNode(state, action.payload.parents, action.payload.uuid);
        case duck.types.REORDER_NODE:
          return reorderNode(
            state,
            action.payload.parents,
            action.payload.oldIndex,
            action.payload.newIndex
          );
        case duck.types.CHANGE_NODE:
          return changeNode(
            state,
            action.payload.parents,
            action.payload.uuid,
            action.payload.key,
            action.payload.value
          );
        case duck.types.SET_NODES:
          return action.payload;
        case duck.types.CHANGE_NODE_SETTINGS:
          return changeNodeSettings(
            state,
            action.payload.parents,
            action.payload.uuid,
            action.payload.values
          );
        case duck.types.CLEAR_TREE:
          return duck.initialState;
        default:
          return state;
      }
    },
    selectors: {
      root: state => state
    },
    creators: (duck) => ({
      addNode: (parents, values, settings, name, id) => (
        {
          type: duck.types.ADD_NODE,
          payload: { parents, settings, name, id }
        }),
      removeNode: (parents, uuid) => (
        {
          type: duck.types.REMOVE_NODE,
          payload: { parents, uuid }
        }),
      setNodes: (nodes) => (
        {
          type: duck.types.SET_NODES,
          payload: nodes
        }),
      reorderNode: (parents, oldIndex, newIndex) => (
        {
          type: duck.types.REORDER_NODE,
          payload: { parents, oldIndex, newIndex }
        }),
      changeNode: (parents, uuid, key, value) => (
        {
          type: duck.types.CHANGE_NODE,
          payload: { parents, uuid, key, value }
        }),
      changeNodeSettings: (parents, uuid, values) => (
        {
          type: duck.types.CHANGE_NODE_SETTINGS,
          payload: { parents, uuid, values }
        }),
      clearTree: () => ({ type: duck.types.CLEAR_TREE })
    })
  });

  return output;
};
