import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Select } from '../../shared/form';
import { TextArea, Input } from '../../shared/form';
import styles from './_BundleForm.scss';

export default class BundleForm extends Component {
  static propTypes = {
    changeNodeSettings: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      description: PropTypes.string,
      filterValue: PropTypes.any,
      filterColumn: PropTypes.string,
      id: PropTypes.string
    }).isRequired,
    columns: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  handleDescriptionChange(value) {
    this.props.changeNodeSettings({ submittedValues: { description: value } });
  }

  handleIdChange(value) {
    this.props.changeNodeSettings({ submittedValues: { id: value } });
  }

  handleFilterColumnChange(value) {
    if (value !== this.props.settings.filterColumn) {
      this.props.changeNodeSettings(
        {
          submittedValues: { filterColumn: value, filterValue: null }
        }
      );
    }
  }

  handleFilterValueChange(value) {
    this.props.changeNodeSettings({ submittedValues: { filterValue: value } });
  }

  render() {
    const columns = this.props.columns.map(x => (
      {
        label: x.name,
        value: x.uuid
      }
    ));
    let values = [];
    if (this.props.settings.filterColumn && this.props.columns.length) {
      values = this.props.columns.filter(
        x => x.uuid === this.props.settings.filterColumn)[0].values.map(x => (
          {
            label: x,
            value: x
          }
        )
      );
    }
    return (
      <div>
        <label htmlFor="description" className="pt-label">
          Description
          <TextArea
            value={this.props.settings.description}
            updateValue={this.handleDescriptionChange.bind(this)}
          />
        </label>
        <Input
          value={this.props.settings.id}
          updateValue={this.handleIdChange.bind(this)}
          label="Indentifier"
        />
        <Select
          options={columns}
          value={this.props.settings.filterColumn}
          updateValue={this.handleFilterColumnChange.bind(this)}
          label="Filter Column"
        />
        <Select
          options={values}
          value={this.props.settings.filterValue}
          updateValue={this.handleFilterValueChange.bind(this)}
          disabled={!this.props.settings.filterColumn}
          label="Filter Value"
        />
      </div>
    );
  }
}
