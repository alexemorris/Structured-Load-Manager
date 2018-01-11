import React from 'react';
import PropTypes from 'prop-types';
import styles from './AddNode.scss';

const AddNode = ({ addFunction }) => (
  <div className={styles.addNode} onClick={addFunction}>
    <i className="fa fa-plus" />
  </div>
);

AddNode.propTypes = {
  addFunction: PropTypes.func.isRequired
};

export default AddNode;
