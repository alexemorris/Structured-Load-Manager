import * as React from 'react';
import Input from './Input';

export default class TextArea extends Input {
  render() {
    return (
      <label className="pt-label">
        {this.props.label}
        <textarea
          onChange={this.setValue.bind(this)}
          value={this.state.value}
          onBlur={this.updateValue.bind(this)}
          className="pt-input"
        />
      </label>
    );
  }
}
