import * as React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar, AnchorButton } from '@blueprintjs/core';
import styles from './_CheckFilesProgress.scss';

const CheckFilesProgress = ({ progress, startVerification, directory, mapping, type }) => {
  let inner;

  if (!mapping) {
    <div className={styles.progress}>
      <div className={styles.verified}>{`Please specify a ${type} mapping in the previous step`}</div>
      <AnchorButton disabled onClick={startVerification}>Start Verification</AnchorButton>
    </div>
  }

  if (!directory) {
    <div className={styles.progress}>
      <div className={styles.verified}>Please choose a root directory above</div>
      <AnchorButton disabled onClick={startVerification}>Start Verification</AnchorButton>
    </div>
  }

  if (progress >= 1) {
    inner = (
      <div className={styles.progress}>
        <div className={styles.verified}>All files checked. See above for results.</div>
        <AnchorButton onClick={startVerification}>Check Again</AnchorButton>
      </div>
    );
  } else if (progress > 0) {
    inner = (
      <div className={styles.progress}>
        <ProgressBar value={progress} intent="primary" />
      </div>
    );
  } else {
    inner = (
      <div className={styles.progress}>
        <AnchorButton onClick={startVerification}>Start Verification</AnchorButton>
      </div>
    );
  }

  return (
    <div className={styles.checkFilesProgress} >
      {inner}
    </div>
  );
};

CheckFilesProgress.propTypes = {
  progress: PropTypes.number.isRequired,
  startVerification: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
};


export default CheckFilesProgress;
