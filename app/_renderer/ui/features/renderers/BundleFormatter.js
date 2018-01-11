import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleFormatter.css';

export default class LongSimpleFormatter extends Component {
  static propTypes = {
    value: PropTypes.string
  }

  static defaultProps = {
    value: 'Not in bundle'
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    const value = this.props.value.substr(2).toLowerCase();
    return <div className={styles.titlecase} title={this.props.value}>{value}</div>;
  }
}
