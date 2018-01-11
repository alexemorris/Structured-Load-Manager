import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './Styles.css';

export default class Switch extends PureComponent {

  static propTypes = {
    updateValue: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    label: PropTypes.node,
    justify: PropTypes.bool,
    flip: PropTypes.bool,
    large: PropTypes.bool,
    switch: PropTypes.bool
  }

  static defaultProps = {
    label: '',
    justify: false,
    flip: false,
    large: false,
    switch: false
  }

  render() {
    let className = 'pt-control'

    if (this.props.switch) {
      className += ' pt-switch';
    } else {
      className += ' pt-checkbox';
    }

    if (this.props.flip) className += ' pt-align-right';
    if (this.props.large) className += ' pt-large';

    const label = (<span className={styles.switchLabel} style={{ paddingRight: this.props.flip ? '2em': null, display: 'block' }}>{this.props.label}</span>);

    return (
      <label className={className}>
        {label}
        <input
          checked={this.props.checked}
          onChange={(e) => {
            if (e.target.checked !== this.props.checked) {
              this.props.updateValue(e.target.checked);
            }
          }}
          type="checkbox"
        />
        <span className="pt-control-indicator" />
      </label>
    );
  }
}
