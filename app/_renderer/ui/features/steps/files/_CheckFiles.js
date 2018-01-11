import React from 'react';
import PropTypes from 'prop-types';
import { AnchorButton } from '@blueprintjs/core';
import styles from './_CheckFiles.scss';
import CheckFilesList from './_CheckFilesList';
import CheckFilesProgress from './_CheckFilesProgress';


const CheckFiles = ({
    browseDirectory,
    startVerification,
    files,
    mappings
}) => (
  <div className={styles.checkFiles}>
    <div className={styles.textColumn}>
      <div className={styles.header}>
        <h1>Text Files</h1>
        <div className={styles.selectDirectory}>
          <h2>Root Directory</h2>
          <AnchorButton onClick={() => browseDirectory('text')} className="pt-minimal">{files.text.directory}</AnchorButton>
        </div>
      </div>
      <CheckFilesList files={files.text.results} type="text" />
      <CheckFilesProgress
        {...files.text}
        type="text"
        mapping={mappings.text}
        startVerification={() => startVerification('text')}
      />
    </div>
    <div className={styles.nativeColumn}>
      <div className={styles.header}>
        <h1>Native Files</h1>
        <div className={styles.selectDirectory}>
          <h2>Root Directory</h2>
          <AnchorButton onClick={() => browseDirectory('native')} className="pt-minimal">{files.native.directory}</AnchorButton>
        </div>
      </div>
      <CheckFilesList files={files.native.results} type="native" />
      <CheckFilesProgress
        {...files.native}
        type="native"
        mapping={mappings.native}
        startVerification={() => startVerification('native')}
      />
    </div>
  </div>
);


CheckFiles.propTypes = {
  browseDirectory: PropTypes.func.isRequired,
  startVerification: PropTypes.func.isRequired,
  setMapping: PropTypes.func.isRequired,
  files: PropTypes.object,
};

export default CheckFiles;
