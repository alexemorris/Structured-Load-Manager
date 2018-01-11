import React, { PureComponent } from 'react';
import { ipcRenderer } from 'electron';
import { AnchorButton } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import Tree from '../../tree/Tree';
import styles from './_ColumnStep.scss';
import ColumnPreview from '../../preview/_ColumnPreview';
import ColumnForm from './_ColumnForm';

import { REQUEST_COLUMN, RESPOND_COLUMN, AUTOMAP_COLUMNS } from './duck';

export default class ColumnStep extends PureComponent {


  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    active: PropTypes.string
  };

  static defaultProps = {
    header: [],
    nodes: [],
    type: null,
    active: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      values: [],
      type: null,
      loading: true
    };
  }

  componentDidMount() {
    ipcRenderer.on(RESPOND_COLUMN, (event, arg) => {
      this.setState({
        values: arg.values,
        loading: false
      });
    });
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(RESPOND_COLUMN);
  }

  loadData() {
    if (!this.props.active) {
      this.setState({ loading: false });
      return;
    }
    const currentColumn = this.props.nodes.filter(x => x.uuid === this.props.active)[0];
    const jsonCurrent = JSON.stringify(currentColumn.settings);

    if (jsonCurrent !== this.lastColumn) {
      this.setState({ loading: true, type: currentColumn.settings.type });
      ipcRenderer.send(REQUEST_COLUMN, currentColumn.uuid);
      this.lastColumn = jsonCurrent;
    }
  }

  render() {
    return (
      (
        <div className={styles.configurecolumns}>
          <div className={styles.columnTreeContainer}>
            <div className={styles.columnTree}>
              <Tree
                {...this.props}
                active={[this.props.active]}
                maxDepth={1}
                blankButton={(
                  <div className={styles.autoMap}>
                    <h1>No columns defined</h1>
                    <AnchorButton onClick={() =>
                      ipcRenderer.send(AUTOMAP_COLUMNS)}
                    >
                      Auto Map
                    </AnchorButton>
                  </div>
                )}
                form={(config) => (
                  <ColumnForm
                    header={this.props.header}
                    {...config}
                  />
                )}
              />
            </div>
          </div>
          <div className={styles.bundlePreview}>
            <ColumnPreview {...this.state} />
          </div>
        </div>
      )
    );
  }
}
