import * as React from 'react';
import PropTypes from 'prop-types';
import Header from './_Header';

const TimelineComponent = ({ children, name, progress }) => (
  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
    <Header title={name} progress={progress} />
    {children}
  </div>
);

TimelineComponent.propTypes = {
  name: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  progress: PropTypes.shape({
    message: PropTypes.string,
    progress: PropTypes.number,
    level: PropTypes.oneOf(['fatal', 'warn', null]),
    complete: PropTypes.bool,
    remaining: PropTypes.string
  }).isRequired
};

export default TimelineComponent;
