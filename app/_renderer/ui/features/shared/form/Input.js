import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Input extends Component {

  static propTypes = {
    updateValue: PropTypes.func,
    value: PropTypes.string,
    type: PropTypes.oneOf(['text', 'password']),
    className: PropTypes.string,
    disabled: PropTypes.bool,
    label: PropTypes.node,
    justify: PropTypes.bool,
    flip: PropTypes.bool
  }

  static defaultProps = {
    updateValue: () => null,
    value: '',
    type: 'text',
    className: 'pt-input',
    disabled: false,
    label: null,
    justify: false,
    flip: false
  }

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,
      changed: false
    };
  }

  setValue(event) {
    this.setState({ value: event.target.value });
  }

  updateValue(event) {
    this.props.updateValue(event.target.value);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.props.updateValue(e.target.value);
      this.ref.blur();
    }
  }

  render() {
    let className = this.props.className;
    if (this.props.disabled) {
      className += ' pt-disabled';
    }

    const styles = {};

    if (this.props.justify) {
      styles.textAlign = 'right';
    }
    const label = (<span>{this.props.label}</span>);
    return (
      <label className="pt-label">
        {this.props.flip || label}
        <input
          onChange={this.setValue.bind(this)}
          type={this.props.type}
          value={this.state.value}
          onBlur={this.updateValue.bind(this)}
          onKeyPress={this.handleKeyPress.bind(this)}
          className={className}
          ref={(r) => { this.ref = r; }}
        />
        {!this.props.flip || label}
      </label>
    );
  }

}
