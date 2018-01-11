import React from 'react';
import ReactList from 'react-list';
import PropTypes from 'prop-types';
import styles from './_ColumnPreview.scss';
import DateFormatter from '../renderers/DateFormatter';
import FixedWidthFormatter from '../renderers/FixedWidthFormatter';
import FileTypeFormatter from '../renderers/FileTypeFormatter';
import SimpleFormatter from '../renderers/SimpleFormatter';
import BoolFormatter from '../renderers/BoolFormatter';

class ColumnPreview extends React.Component {

  static propTypes = {
    values: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ])
    ),
    type: PropTypes.string,
    loading: PropTypes.bool
  }

  static defaultProps = {
    values: [],
    type: null,
    loading: true
  }

  renderItem(index, key) {
    let item = null;
    switch (this.props.type) {
      case 'date':
        item = <DateFormatter value={this.props.values[index] || ''} />;
        break;
      case 'number':
        item = <FixedWidthFormatter value={this.props.values[index] || ''} />;
        break;
      case 'filetype':
        item = <FileTypeFormatter value={this.props.values[index] || ''} />;
        break;
      case 'fixed':
        item = <FixedWidthFormatter value={this.props.values[index] || ''} />;
        break;
      case 'bool':
        item = <BoolFormatter value={this.props.values[index] || ''} />;
        break;
      default:
        item = <SimpleFormatter value={this.props.values[index] || ''} />;
        break;
    }
    return <div className={styles.entry} key={key}>{item}</div>;
  }

  render() {
    if (this.props.loading) {
      return (
        <div className={styles.loading}>
          <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
        </div>
      );
    }
    return (
      <div className={styles.columnPreview}>
        <div className={styles.configureColumnsPreviewCon}>
          <div className={styles.previewContainer}>
            <div className={styles.previewList}>
              <ReactList
                itemRenderer={::this.renderItem}
                length={this.props.values.length}
                type="uniform"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnPreview;
