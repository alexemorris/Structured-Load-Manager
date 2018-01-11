import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleFormatter.css';
import castBool from '../../../../utils/castBool';

export default class BoolFormatter extends Component {
  static propTypes = {
    value: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    const bool = castBool(this.props.value);
    if (bool) {
      return <div className={styles.true} title={this.props.value} />;
    }
    return <div className={styles.false} title={this.props.value} />;
  }
}
