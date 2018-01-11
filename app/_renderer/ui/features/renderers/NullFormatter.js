import React from 'react';
import SimpleFormatter from './SimpleFormatter';
import styles from './NullFormatter.css';

export default class NullFormatter extends SimpleFormatter {
  render() {
    return (
      <div title={'Empty'} className={styles.null}>Empty</div>
    );
  }
}
