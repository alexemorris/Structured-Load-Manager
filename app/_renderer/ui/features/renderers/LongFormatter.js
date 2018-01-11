import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LongSimpleFormatter extends Component {
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
    const inVal = this.props.value === null ? '' : this.props.value;
    const value = inVal.length < 120 ? inVal :
      `${inVal.substring(0, 120)}...`;
    return <div title={this.props.value}>{value}</div>;
  }
}
