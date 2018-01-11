import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleFormatter.css';

export default class FixedWidthFormatter extends Component {
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
    return <div className={styles.fixedwidth} title={this.props.value}>{this.props.value}</div>;
  }
}
