import React from 'react';
import SimpleFormatter from './SimpleFormatter';
import NullFormatter from './NullFormatter';

import styles from './CatergoricalFormatter.scss';

export default class CategoricalFormatter extends SimpleFormatter {
  render() {
    return (
      <div title={this.props.value.value} className={styles.iconContainer}>
        {this.props.value.value ? <span className={styles.value}>{this.props.value.value}</span> : <NullFormatter value="" />}
        <span className={styles.count}>{this.props.value.count}</span>
      </div>
    );
  }
}
