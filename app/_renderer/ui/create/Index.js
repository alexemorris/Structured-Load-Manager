import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import Timeline from '../features/timeline/container';
import TimelineComponent from '../features/timeline/_TimelineComponent';

import MetadataStep from '../features/steps/metadata/container';
import MappingStep from '../features/steps/mapping/container';
import FilesStep from '../features/steps/files/container';
import BundleStep from '../features/steps/bundles/container';
import ColumnStep from '../features/steps/columns/container';
import PackageStep from '../features/steps/packaging/container';
import PreviewStep from '../features/steps/preview/container';
import SearchStep from '../features/steps/search/container';

// import ConfigureColumns from './ConfigureColumnsContainer';

import {
  SET_PROGRESS,
  SET_ERROR,
  SET_COMPLETE
} from './constants';

class CreateEbundle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: '',
      progress: 0.4,
      complete: true,
      level: null,
      remaining: null
    };
  }

  componentDidMount() {
    ipcRenderer.on(SET_PROGRESS, (event, arg) => {
      this.setState({
        progress: Math.max(arg.progress),
        level: null,
        complete: false,
        message: arg.message,
        remaining: arg.remaining
      });
    });

    ipcRenderer.on(SET_ERROR, (event, arg) => {
      this.setState({
        progress: Math.max(arg.progress),
        level: arg.level,
        complete: false,
        message: arg.message,
        remaining: null
      });
    });

    ipcRenderer.on(SET_COMPLETE, () => {
      this.setState({
        progress: 0,
        level: null,
        complete: true,
        message: '',
        remaining: null
      });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(SET_PROGRESS);
    ipcRenderer.removeAllListeners(SET_ERROR);
    ipcRenderer.removeAllListeners(SET_COMPLETE);
  }

  render() {
    return (
      <div>
        <Timeline>
          <TimelineComponent name="Choose Metadata" progress={this.state} valid >
            <MetadataStep />
          </TimelineComponent>
          <TimelineComponent name="Configure Columns" progress={this.state} valid>
            <ColumnStep />
          </TimelineComponent>
          <TimelineComponent name="Preview Table" progress={this.state} valid>
            <PreviewStep />
          </TimelineComponent>
          <TimelineComponent name="Required Mappings" progress={this.state} valid>
            <MappingStep />
          </TimelineComponent>
          <TimelineComponent name="Check Files" progress={this.state} valid>
            <FilesStep />
          </TimelineComponent>
          <TimelineComponent name="Configure Search Index" progress={this.state} valid>
            <SearchStep />
          </TimelineComponent>
          <TimelineComponent name="Configure Bundles" progress={this.state} valid>
            <BundleStep />
          </TimelineComponent>
          <TimelineComponent name="Package" progress={this.state} valid>
            <PackageStep />
          </TimelineComponent>
        </Timeline>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators([], dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateEbundle);
