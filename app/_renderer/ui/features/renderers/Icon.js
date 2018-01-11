import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Icon.scss';

function Icon(props) {
  let className;
  className = classNames(
      'fa',
      `${props.name}`,
      { [`fa-${props.size}x`]: props.size },
    );

  if (props.hoverable) {
    className = classNames(className, styles.iconHoverable);
  } else {
    className = classNames(className, styles.icon);
  }

  if (props.active) {
    className = classNames(className, styles.iconActive);
  }

  const handleClick = props.handleClick ? props.handleClick : () => undefined;

  className = classNames(className, styles.icon);

  const style = {
    color: props.color
  };

  const badge = props.count ? <div className={styles.iconBadge}><p>{props.count}</p></div> : null;

  return (
    <div title={props.title} className={styles.iconContainer}>
      {badge}
      <i className={className} aria-hidden="true" style={style} onClick={handleClick} />
    </div>
  );
}

Icon.defaultProps = {
  size: 1,
  hoverable: false,
  active: false,
  handleClick: null,
  color: undefined,
  title: '',
  count: null
};

Icon.propTypes = {
  size: PropTypes.number,
  name: PropTypes.string.isRequired,
  title: PropTypes.string,
  handleClick: PropTypes.func,
  hoverable: PropTypes.bool,
  count: PropTypes.number,
  active: PropTypes.bool,
  color: PropTypes.string
};

export default Icon;
