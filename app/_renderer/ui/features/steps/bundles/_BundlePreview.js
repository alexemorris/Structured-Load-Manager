import * as React from 'react';
import PropTypes from 'prop-types';
// import ConfigureColumnsPreview from './ConfigureColumnsPreview';
import styles from './_BundlePreview.scss';

const BundlePreview = ({ values }) => (
  <div className={styles.bundlePreview}>
    <div className={styles.configureColumnsPreviewCon}>
      {/* <div className={styles.header}>
        <h1>Column Preview</h1>
      </div> */}
      <div className={styles.previewContainer}>
        <div className={styles.previewList}>
          {values.map((x, i) => (<div className={styles.entry} key={i}>{x}</div>))}
        </div>
      </div>
    </div>
  </div>
);


BundlePreview.propTypes = {
  values: PropTypes.arrayOf(PropTypes.object),
};

BundlePreview.defaultProps = {
  values: []
};


export default BundlePreview;
