import React from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from '@blueprintjs/core';
import styles from './_Header.scss';

const Progress = ({ message, level, complete, progress, remaining }) => {
  if (level === 'warn') {
    return (
      <div className={styles.progress}>
        <i className="fa-warn fa" />
        <p>{message || 'Unknown warning, see logs'}</p>
      </div>
    );
  } else if (level === 'fatal') {
    return (
      <div className={styles.progress}>
        <i className="fa-error fa" />
        <p>{message || 'Fatal Error, see logs'}</p>
      </div>
    );
  } else if (complete) {
    return (
      <div className={`${styles.progress} ${styles.complete}`}>
        <ProgressBar value={0} intent="success"/>
        <p>{'Processing thread ready'}</p>
      </div>
    );
  } else if (progress === -1) {
    return (
      <div className={styles.progress}>
        <ProgressBar value={1} intent="pt-intent-success" />
        <div className={styles.progressInfo}>
          <p className={styles.progressMessage}>{message || 'Processing'}</p>
          <p className={styles.timeRemaining}>This may take a while</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.progress}>
      <ProgressBar value={progress} intent="pt-intent-success" className="pt-no-stripes" />
      <div className={styles.progressInfo}>
        <p className={styles.progressMessage}>{message || 'Processing'}</p>
        <p className={styles.timeRemaining}>{`Around ${remaining} remaining`}</p>
      </div>
    </div>
  );
};

Progress.propTypes = {
  message: PropTypes.string,
  level: PropTypes.oneOf(['warn', 'fatal', null]),
  complete: PropTypes.bool,
  progress: PropTypes.number,
  remaining: PropTypes.string
};

Progress.defaultProps = {
  message: '',
  progress: 0,
  level: null,
  complete: true,
  remaining: 'Unknown'
};

export default Progress;
