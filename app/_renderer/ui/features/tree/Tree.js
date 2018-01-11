import * as React from 'react';
import PropTypes from 'prop-types';
import TreeNode from './TreeNode'
import styles from './Tree.scss';
import AddNode from './AddNode';


const Tree = (props) => (
  <div className={styles.nodeTreeContainer}>
    <TreeNode {...props} >
      {props.children}
    </TreeNode>
    {props.nodes.length ? null : props.blankButton}
    <AddNode addFunction={props.addNode} />

  </div>
);


Tree.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object),
  parents: PropTypes.arrayOf(PropTypes.string),
  active: PropTypes.arrayOf(PropTypes.string),
  indent: PropTypes.number,
  blankButton: PropTypes.node,
  maxDepth: PropTypes.number,
  addNode: PropTypes.func.isRequired,
  settings: PropTypes.func
};

Tree.defaultProps = {
  nodes: [],
  active: [],
  parents: [],
  blankButton: null,
  maxDepth: 1,
  settings: () => null,
  indent: 0,
  uuid: undefined,
  children: null
};

export default Tree;
