import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Select extends Component {

  static propTypes = {
    updateValue: PropTypes.func,
    value: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.node
  }

  static defaultProps = {
    updateValue: () => null,
    options: [],
    value: '',
    className: 'pt-select',
    disabled: false,
    label: null
  }

  updateValue(event) {
    this.props.updateValue(event.target.value === '________NOT______SELECTED________' ? null : event.target.value);
  }

  render() {
    return (
      <label className="pt-label" style={{ display: 'block' }}>
        {this.props.label}
        <div className={`pt-select ${this.props.disabled ? 'pt-disabled' : null}`}>
          <select
            onChange={this.updateValue.bind(this)}
            value={this.props.value === null ? 'NOT_SELECTED' : this.props.value}
            className={this.props.className}
          >
            <option value="________NOT______SELECTED________">Select an option..</option>
            {this.props.options.map(x => <option key={x.value} value={x.value}>{x.label}</option>)}
          </select>
        </div>
      </label>
    );
  }
}
