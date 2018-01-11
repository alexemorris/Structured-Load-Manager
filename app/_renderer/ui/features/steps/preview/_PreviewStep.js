import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PreviewTable from './_PreviewTable';
import styles from './_PreviewStep.scss';
import { ipcRenderer } from 'electron';


class PreviewStep extends Component {

  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    widths: PropTypes.object,
    changeNodeSettings: PropTypes.func,
    responseChannel: PropTypes.string.isRequired,
    requestChannel: PropTypes.string.isRequired
  }

  static defaultProps = {
    columns: [],
    changeNodeSettings: () => null
  }

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      loading: true,
      rows: []
    };
  }

  componentDidMount() {
    ipcRenderer.on(this.props.responseChannel, (event, arg) => {
      this.setState({
        rows: arg.rows,
        loading: false
      });
    });
    ipcRenderer.send(this.props.requestChannel, this.props.columns);
    window.addEventListener('resize', this.resetDimensions);
    this.resetDimensions();
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners(this.props.responseChannel);
    window.removeEventListener('resize', this.resetDimensions);
  }

  resetDimensions() {
    this.setState({
      width: this.canvasContainer.clientWidth,
      height: this.canvasContainer.clientHeight
    });
  }

  render() {
    const columns = this.props.columns.map(x => ({
      name: x.uuid,
      title: x.name,
      dataType: x.settings.type
    }));

    return (
      <div className={styles.preview}>
        <div className={styles.previewContainer}>
          <div
            className={styles.tableContainer}
            ref={(canvasContainer) => { this.canvasContainer = canvasContainer; }}
          >
            {this.state.loading ? (
              <div className={styles.loading}>
                <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
              </div>
            ) : (
              <PreviewTable
                rows={this.state.rows}
                loading={this.state.loading}
                columns={columns}
                width={this.state.width}
                height={this.state.height}
                widths={this.props.widths}
                changeNodeSettings={this.props.changeNodeSettings}
              />
          )}
          </div>
        </div>
      </div>
    );
  }
}


export default PreviewStep;
