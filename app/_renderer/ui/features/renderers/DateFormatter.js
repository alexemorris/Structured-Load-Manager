import React from 'react';
import SimpleFormatter from './SimpleFormatter';
// import momentPropTypes from 'react-moment-proptypes';
import styles from './SimpleFormatter.css';

export default class DateFormatter extends SimpleFormatter {
  render() {
    let val;
    if (this.props.value) {
      val = <div className={styles.date}>{this.props.value}</div>;
    } else {
      val = <p className={styles.grey}>Undated</p>;
    }
    return (
      <div title={this.props.value}>{val}</div>
    );
  }
}
