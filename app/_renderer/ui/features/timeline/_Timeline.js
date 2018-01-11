import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './_Timeline.scss';

const Timeline = ({ step, children, nextStep, prevStep, setStep }) => (
  <div className={styles.timeline}>
    <div className={styles.viewport}>
      {children[step]}
    </div>
    <div className={styles.progress}>
      <i className="fa fa-chevron-left" aria-hidden="true" onClick={step !== 0 ? prevStep : () => null} />
      <div className={styles.progressBar}>
        <div className={styles.progressRect} style={{ width: `${Math.min((step * 100) / (children.length - 1), 100)}%` }} />
        <div className={styles.progressEntries}>
          {children.map((x, i) => (
            <div
              className={
                `${styles.progressSection}
                  ${i < step ? styles.activeEntry : ''}
                  ${i === step ? styles.currentEntry : ''}`
                }
              key={`progress-${x.props.name}`}
            >
              <div
                className={`${styles.progressCircle}`}
                key={x.props.name}
                onClick={() => (i < step ? setStep(i) : () => null)}
                role="button"
                tabIndex={i}
              />
            </div>
          )
        )}
        </div>
      </div>
      <i className={`fa fa-chevron-right ${children[step].props.valid ? '' : styles.disabled}`} aria-hidden="true" onClick={step !== children.length - 1 && children[step].props.valid ? nextStep : () => null} />
    </div>
  </div>
);


Timeline.propTypes = {
  step: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  nextStep: PropTypes.func,
  prevStep: PropTypes.func,
  setStep: PropTypes.func
};

Timeline.defaultProps = {
  step: 0,
  children: [],
  nextStep: () => null,
  prevStep: () => null,
  setStep: () => null
};


export default Timeline;
