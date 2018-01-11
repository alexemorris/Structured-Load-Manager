import * as React from 'react';
import PropTypes from 'prop-types';
import styles from './_CheckFilesList.scss';
import ReactList from 'react-list';

export default class CheckFilesList extends React.Component {

  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      file: PropTypes.string,
      missing: PropTypes.bool,
      empty: PropTypes.bool,
      blank: PropTypes.bool,
    })),
    type: PropTypes.string
  }

  static defaultProps = {
    files: [],
    type: 'File'
  }

  renderItem(index, key) {
    const file = this.props.files[index];
    let icon = 'fa-check';
    if (file.missing) {
      icon = 'fa-close';
    } else if (file.empty) {
      icon = 'fa-exclamation-triangle';
    }
    if (file.blank) {
      return (
        <li key={`file-${file.uuid}`} className={styles.fileEntry}>
          <div className={styles.fileName}>
            <span className={styles.uuid}>{file.uuid}</span>
            {`No ${this.props.type} link provided`}
          </div>
          <i className={`fa ${icon}`} />
        </li>
      );
    }
    return (
      <li key={`file-${key}`} className={styles.fileEntry}>
        <div className={styles.fileName}>
          <span className={styles.uuid}>{file.uuid}</span>
          <span className={styles.file}>{file.file}</span>
        </div>
        <i className={`fa ${icon}`} />
      </li>
    );
  }

  render() {
    return (
      <div className={styles.checkFilesList} >
        <ul className={styles.checkFilesUl}>
          <ReactList
            itemRenderer={::this.renderItem}
            length={this.props.files.length}
            type="uniform"
          />
        </ul>
      </div>
    );
  }
}
