import * as React from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@blueprintjs/core';
import styles from './_MappingStep.scss';

const MappingDescription = ({ name, description, required }) => {
  const target = <h1>{name} <i className="fa fa-info-circle" /> </h1>;
  const content = <div className={styles.infoContainer}>{description}</div>;
  let inner;
  if (description !== '') {
    inner = <Popover content={content} target={target} />;
  } else {
    inner = <h1>{name}</h1>;
  }
  return <div className={styles.mappingDescription}>{inner}{required ? <span className={styles.required}>*</span> : null}</div>;
};

MappingDescription.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  required: PropTypes.boolean
};

MappingDescription.defaultProps = {
  description: '',
  required: false
};


export default MappingDescription;
