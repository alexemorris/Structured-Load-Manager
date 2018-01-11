import React from 'react';
import PropTypes from 'prop-types';
import Progress from './_Progress';
import styles from './_Header.scss';

const Header = (props) => (
  <div className={styles.header}>
    <h1>{props.title}</h1>
    <Progress {...props.progress} />
  </div>
);

Header.propTypes = {
  title: PropTypes.string,
  progress: PropTypes.shape({
    message: PropTypes.string,
    progress: PropTypes.number,
    level: PropTypes.oneOf(['fatal', 'warn', null]),
    complete: PropTypes.bool,
    remaining: PropTypes.string
  }).isRequired
};

Header.defaultProps = {
  title: ''
};


export default Header;
