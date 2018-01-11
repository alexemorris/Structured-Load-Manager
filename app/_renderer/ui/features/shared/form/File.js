import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AnchorButton } from '@blueprintjs/core';
import { ipcRenderer } from 'electron';

export default class File extends Component {

  static propTypes = {
    updateValue: PropTypes.func,
    value: PropTypes.string,
    directory: PropTypes.bool,
    label: PropTypes.node
  }

  static defaultProps = {
    updateValue: () => null,
    value: '',
    directory: false,
    label: null
  }


  chooseFile() {
    const path = ipcRenderer.sendSync(this.props.directory ? 'BROWSE_DIRECTORY' : 'BROWSE_FILE');
    if (path) {
      this.props.updateValue(path);
    }
  }

  render() {
    return (
      <div style={{ marginBottom: '10px' }}>
        <div>
          {this.props.label}
        </div>
        <AnchorButton iconName="document" onClick={this.chooseFile.bind(this)} >{this.props.value}</AnchorButton>
      </div>
    );
  }

}
