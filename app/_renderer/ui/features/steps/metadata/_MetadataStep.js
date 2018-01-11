import * as React from 'react';
import PropTypes from 'prop-types';
import { AnchorButton } from '@blueprintjs/core';
import Markdown from 'markdown-to-jsx';
import styles from './_MetadataStep.scss';
import instructions from './instructions.md';

const MetadataStep = ({
  filename,
  directory,
  processing,
  error,
  rows,
  columns,
  chooseMetadata
}) => {

  if (error) {
    return (
      <div className={styles.chooseDirectory}>
        <div className={styles.mainContent}>
          <i className="fa fa-warning" aria-hidden="true" />
          <div className={styles.instructions}>
            <h2>Invalid input metadata</h2>
            <p>{error}</p>
            <AnchorButton className="pt-minimal pt-intent-warning" iconName="document" onClick={chooseMetadata} >{filename}</AnchorButton>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className={styles.chooseDirectory}>
        <div className={styles.mainContent}>
          <i className="fa fa-cog fa-spin" aria-hidden="true" />
          <div className={styles.instructions}>
            <h2>Processing metadata</h2>
          </div>
        </div>
      </div>
    );
  } else if (rows && columns) {
    return (
      <div className={styles.chooseDirectory}>
        <div className={styles.mainContent}>
          <i className="fa fa-check" aria-hidden="true" />
          <div className={styles.instructions}>
            <h2>Metadata valid</h2>
            <p>{`Parsed metadata with ${rows} rows & ${columns} columns.`}</p>
            <div className={styles.successControls}>
                <AnchorButton className="pt-minimal pt-intent-success" iconName="document" onClick={chooseMetadata} >{filename}</AnchorButton>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.chooseDirectory}>
      <div className={styles.mainContent}>
        <i className="fa fa-file-text" aria-hidden="true" onClick={chooseMetadata} />
        <div className={styles.instructions}>
          <Markdown>{instructions}</Markdown>
          <AnchorButton className="pt-minimal" iconName="document" onClick={chooseMetadata} >Choose file</AnchorButton>
        </div>
      </div>
    </div>
  );
};


MetadataStep.propTypes = {
  entries: PropTypes.arrayOf(PropTypes.object),
  filename: PropTypes.string,
  chooseMetadata: PropTypes.func.isRequired,
  processing: PropTypes.bool,
  invalid: PropTypes.bool,
  uuidCols: PropTypes.arrayOf(PropTypes.string),
  uuidSelection: PropTypes.string,
  setMapping: PropTypes.func.isRequired,
};

MetadataStep.defaultProps = {
  entries: [],
  filename: null,
  uuidSelection: null,
  processing: false,
  invalid: false,
  uuidCols: []
};

export default MetadataStep;
