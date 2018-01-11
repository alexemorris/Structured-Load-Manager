import React, { PureComponent } from 'react';
import { ipcRenderer } from 'electron';
import PropTypes from 'prop-types';
import { Select } from '../../shared/form';

import Tree from '../../tree/Tree';
import styles from './_BundleStep.scss';
import ColumnPreview from '../../preview/_ColumnPreview';
import BundleForm from './_BundleForm';

export default class BundleStep extends PureComponent {
  static propTypes = {
    nodes: PropTypes.arrayOf(PropTypes.object),
    columns: PropTypes.arrayOf(PropTypes.object),
    header: PropTypes.arrayOf(PropTypes.string),
    type: PropTypes.string,
    currentBundle: PropTypes.arrayOf(PropTypes.string),
    currentColumn: PropTypes.string,
    selectColumn: PropTypes.func.isRequired,
    requestChannel: PropTypes.string.isRequired,
    responseChannel: PropTypes.string.isRequired,
    requestValues: PropTypes.string.isRequired,
    respondValues: PropTypes.string.isRequired
  };

  static defaultProps = {
    header: [],
    columns: [],
    nodes: [],
    currentColumn: null,
    currentBundle: [],
    type: null,
    active: null,
  };


  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      previewLoading: false,
      preview: [],
      columns: []
    };
  }

  componentDidMount() {
    ipcRenderer.on(this.props.responseChannel, (event, arg) => {
      this.setState({
        preview: arg.values,
        previewLoading: false
      });
    });

    ipcRenderer.on(this.props.respondValues, (event, arg) => {
      this.setState({
        columns: arg.values,
        loading: false
      });
    });

    ipcRenderer.send(this.props.requestValues, (event, this.props.columns));
    this.loadData();
  }

  componentDidUpdate() {
    this.loadData();
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(this.props.responseChannel);
    ipcRenderer.removeAllListeners(this.props.respondValues);
  }


  loadData() {
    if (!this.props.currentBundle) {
      this.setState({ loading: false });
      return;
    }

    if (this.props.currentBundle) {
      const currentFilter = this.props.currentBundle.reverse().reduce((acc, curr) => {
        const current = acc[0].filter(x => x.uuid === curr)[0];
        return [current.nodes, [...acc[1], current.settings]];
      }, [this.props.nodes, []])[1];
      const currentColumn = this.props.columns.filter(x => x.uuid === this.props.currentColumn)[0];
      const jsonCurrent = JSON.stringify({
        filter: currentFilter,
        column: currentColumn
      });
      if ((jsonCurrent !== this.lastBundle) && currentColumn) {
        this.setState({ previewLoading: true, type: currentColumn.settings.type });
        ipcRenderer.send(this.props.requestChannel, {
          filter: currentFilter,
          column: currentColumn
        });
        this.lastBundle = jsonCurrent;
      }
    } else {
      this.lastBundle = '';
      this.setState({ preview: [] });
    }
  }

  render() {
    return (
      <div className={styles.configureBundles}>
        <div className={styles.bundleTreeContainer}>
          <div className={styles.bundleTree}>
            <Tree
              maxDepth={3}
              settingsIcon="fa-filter"
              {...this.props}
              active={this.props.currentBundle}
              form={(config) => {
                return (
                  <BundleForm
                    {...config}
                    columns={this.state.columns}
                  />
                );
              }}
            />
          </div>
        </div>
        <div className={styles.bundlePreview}>
          <div className={styles.selectContainer}>
            <Select
              options={this.props.columns.map(x =>
                ({ label: x.name, value: x.uuid }))
              }
              value={this.props.currentColumn}
              updateValue={(val) => this.props.selectColumn([val])}
            />
          </div>
          <ColumnPreview
            values={this.state.preview}
            loading={this.state.previewLoading}
            type={this.state.type}
          />
        </div>
      </div>
    );
  }
}
