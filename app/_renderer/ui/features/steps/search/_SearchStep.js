import React, { PureComponent } from 'react';
import { ProgressBar, AnchorButton } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';
import ReactList from 'react-list';
import PropTypes from 'prop-types';
import styles from './_SearchStep.scss';
import { Input, Switch } from '../../shared/form';

import { SET_SEARCH_QUERY, SET_SEARCH_RESULTS } from './duck';

class SearchStep extends PureComponent {


  static propTypes = {
    createSearchIndex: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    mapping: PropTypes.shape({
      uuid: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string
    }).isRequired,
    progress: PropTypes.number.isRequired,
    complete: PropTypes.bool.isRequired,
    toggleFullText: PropTypes.func.isRequired,
    changeNodeSettings: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string,
      settings: PropTypes.shape({
        indexed: PropTypes.bool
      })
    })).isRequired,
    error: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    resetSearchIndex: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      results: [],
      loading: false,
    };
  }

  componentDidMount() {
    ipcRenderer.on(SET_SEARCH_RESULTS, (event, arg) => {
      this.setState({
        results: arg.results,
        loading: false
      });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(SET_SEARCH_RESULTS);
  }

  sendSearchQuery(query) {
    this.setState({
      results: [],
      loading: true
    });
    ipcRenderer.send(SET_SEARCH_QUERY, { query });
  }

  renderItem(index, key) {
    return (
      <div className={styles.result} key={key}>
        <div className={styles.resultHeader}>
          <h1>{this.state.results[index][this.props.mapping.title]}</h1>
          {(this.props.mapping.date) ?
            <h4>{this.state.results[index][this.props.mapping.date]}</h4> : null}
        </div>
        <p>{this.state.results[index][this.props.mapping.description]}</p>
      </div>
    );
  }

  activate() {
    this.props.createSearchIndex();
  }

  setColumnIndexed(uuid, indexed) {
    this.props.changeNodeSettings([], uuid, { indexed });
  }

  reset() {
    this.setState({ query: '', results: [] });
    this.props.resetSearchIndex();
  }

  render() {
    const search = this.props.complete ? (
      <Input value={this.props.query} updateValue={this.sendSearchQuery.bind(this)} />
    ) : (
      <ProgressBar value={this.props.progress} intent="primary" />
    );

    const build = <AnchorButton onClick={this.activate.bind(this)}>Start Indexing</AnchorButton>
    const rebuild = <i className="fa fa-refresh" onClick={this.reset.bind(this)} />

    if (this.props.error) {
      return (
        <div className={styles.searchContainer}>
          <div className={styles.mainContent}>
            <i className="fa fa-warn" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Error building index</h2>
              <p>{this.props.error}</p>
              {rebuild}
            </div>
          </div>
        </div>
      );
    }

    if (!this.props.complete && this.props.progress === 0) {
      return (
        <div className={styles.searchContainer}>
          <div className={styles.mainContent}>
            <i className="fa fa-search" aria-hidden="true" />
            <div className={styles.instructions}>
              <p>Click the button below to start indexing your input columns. This may take a while for large input data.</p>
              <div className={styles.searchConfig}>
                <h3 className={styles.setIndexedHeader}>Set Indexed Columns</h3>
                <ul className={styles.indexedColumns}>
                  {this.props.columns.map(col => (
                    <Switch
                      checked={col.settings.indexed}
                      updateValue={(checked) => this.setColumnIndexed(col.uuid, checked)}
                      key={col.uuid}
                      label={col.name}
                      flip
                    />
                  ))}
                </ul>
                <div className={styles.fullTextSwitch}>
                  <Switch
                    checked={this.props.fulltext}
                    updateValue={this.props.toggleFullText}
                    label="Full Text Index"
                    large
                    switch
                  />
                </div>
                {build}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (!this.props.complete) {
      return (
        <div className={styles.searchContainer}>
          <div className={styles.mainContent}>
            <i className="fa fa-cog fa-spin" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Building Search Index</h2>
              <p>{this.props.message}</p>
              <ProgressBar value={this.props.progress} intent="primary" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <h1>{this.props.complete ? 'Search...' : 'Indexing...'}</h1>
          {search}
          {rebuild}
        </div>
        <div className={styles.results}>
          <div className={styles.resultsScroller}>
            {
              this.state.loading ? (
                <div className={styles.loading}>
                  <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
                </div>
              ) : (
                <ReactList
                  itemRenderer={::this.renderItem}
                  length={this.state.results.length}
                />
              )
          }
          </div>
        </div>
      </div>
    );
  }
}

export default SearchStep;
