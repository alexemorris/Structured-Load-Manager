import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleFormatter.css'

export default class SimpleFormatter extends Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string,
      PropTypes.number,
      PropTypes.object,
      PropTypes.bool])
  }

  static defaultProps = {
    value: ''
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.value !== this.props.value;
  }

  render() {
    if (Array.isArray(this.props.value)) {
      const title = this.props.value.join(', ');
      return (
        <div title={title}>
          {this.props.value.map((x) => (
            <div className={styles.bubble} key={x.id}><p>{x}</p></div>
          ))
          }
        </div>
      );
    }
    return <div className={styles.value} title={this.props.value}>{this.props.value}</div>;
  }
}
