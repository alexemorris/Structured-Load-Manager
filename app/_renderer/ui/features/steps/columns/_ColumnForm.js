import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'codemirror/mode/javascript/javascript';
// import { Form, Text, Select, Checkbox } from 'react-form';
import { Select, Input, File, Switch } from '../../shared/form/';
import CodeMirror from 'react-codemirror';
import { Popover } from '@blueprintjs/core';
import styles from './_ColumnForm.scss';
import ColumnAutoComplete from './_ColumnAutoComplete';

const mappingOptions = [
  {
    label: 'Direct Mapping',
    value: 'direct'
  },
  {
    label: 'Template',
    value: 'template'
  },
  {
    label: 'Date',
    value: 'date'
  },
  {
    label: 'Script',
    value: 'script'
  },
  {
    label: 'Read File',
    value: 'readfile'
  },
];


const typeOptions = [
  {
    label: 'String',
    value: 'string'
  },
  {
    label: 'Categorical',
    value: 'categorical'
  },
  {
    label: 'Date',
    value: 'date'
  },
  {
    label: 'Boolean',
    value: 'bool'
  },
  {
    label: 'Number',
    value: 'number'
  },
  {
    label: 'Fixed Width',
    value: 'fixed'
  },
  {
    label: 'File Type',
    value: 'filetype'
  },
];

export default class ColumnForm extends Component {

  static propTypes = {
    settings: PropTypes.shape({
      template: PropTypes.string,
      type: PropTypes.string,
      direct: PropTypes.string,
      mapping: PropTypes.string,
      dateFormat: PropTypes.string,
      script: PropTypes.string,
      indexed: PropTypes.bool,
      autoWidth: PropTypes.bool,
      visible: PropTypes.bool,
      rootPath: PropTypes.string
    }).isRequired,
    header: PropTypes.arrayOf(PropTypes.string).isRequired,
    changeNodeSettings: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      script: props.settings.script
    };
  }

  handleSettingsChange(field, value) {
    if (this.props.settings[field] !== value) {
      this.props.changeNodeSettings({ submittedValues: { [field]: value } });
    }
  }

  render() {
    const mappingInfo = 'Choose direct to map a single column, or template if you\'d like to merge header';
    const mappingInfoContainer = <div className={styles.infoContainer}>{mappingInfo}</div>;
    const mappingLabel = <div>Mapping <i className="fa fa-info-circle" /> </div>;

    const templateInfo = `Template for the data mapping used to combine data. Do not use to map a single field.
      You can use multiple fields in your template e.g '$[fieldname]-$[fieldname2]'`;
    const templateInfoContainer = <div className={styles.infoContainer}>{templateInfo}</div>;
    const templateLabel = <div>Template <i className="fa fa-info-circle" /> </div>;

    const scriptInfo = 'Insert script here. input values available using this.values[NAME]. Return output value as this.output.';
    const scriptInfoContainer = <div className={styles.infoContainer}>{scriptInfo}</div>;
    const scriptLabel = <div>Script <i className="fa fa-info-circle" /> </div>;

    const directInfo = 'Column for the data mapping';
    const directInfoContainer = <div className={styles.infoContainer}>{directInfo}</div>;
    const directLabel = <div>Column <i className="fa fa-info-circle" /></div>;

    const typeInfo = `
      Choose the column type. Strings are rendered as is.
      Dates must be in epoch format (if not use a transformation step).
      Fixed width renders in a fixed width font.
    `;
    const typeInfoContainer = <div className={styles.infoContainer}>{typeInfo}</div>;
    const typeLabel = <div>Column Type <i className="fa fa-info-circle" /> </div>;

    const visibilityInfo = `
      Set Column Visibility. You may use a column purely to be indexed or
      to filter bundles, or have it visible.`;
    const visibilityInfoContainer = <div className={styles.infoContainer}>{visibilityInfo}</div>;
    const visibilityLabel = <div>Visibility <i className="fa fa-info-circle" /> </div>;

    const indexedInfo = `Set whether this column should be indexed. Hidden header can be indexed.
    Arrays & space separated words will be indexed and searchable within the final bundle.`;
    const indexedInfoContainer = <div className={styles.infoContainer}>{indexedInfo}</div>;
    const indexedLabel = <div>Indexed <i className="fa fa-info-circle" /> </div>;

    const autoWidthInfo = 'Set whether this column should fill remaining width';
    const autoWidthInfoContainer = <div className={styles.infoContainer}>{autoWidthInfo}</div>;
    const autoWidthLabel = <div>Auto Width <i className="fa fa-info-circle" /> </div>;

    const dateFormatInfo = 'Set input date format here if it hasn\'t been autodetected.';
    const dateFormatInfoContainer = <div className={styles.infoContainer}>{dateFormatInfo}</div>;
    const dateFormatLabel = <div>Date Format <i className="fa fa-info-circle" /> </div>;

    const rootPathInfo = 'Set root path of files to read';
    const rootPathInfoContainer = <div className={styles.infoContainer}>{rootPathInfo}</div>;
    const rootPathLabel = <div>Root Path <i className="fa fa-info-circle" /> </div>;

    const dateFormat = this.props.settings.mapping === 'date' ? (
      <label htmlFor="dateFormat" className="pt-label">
        <Popover content={dateFormatInfoContainer} target={dateFormatLabel} />
        <Input
          updateValue={(val) => this.handleSettingsChange('dateFormat', val)}
          value={this.props.settings.dateFormat}
          className="pt-input"
        />
      </label>
    ) : null;

    const rootPathInput = this.props.settings.mapping === 'readfile' ? (
      <File
        updateValue={(val) => this.handleSettingsChange('rootPath', val)}
        value={this.props.settings.rootPath}
        label={<Popover content={rootPathInfoContainer} target={rootPathLabel} />}
        directory
      />
    ) : null;

    let mappingInput;

    const header = this.props.header.map(x => ({ value: x, label: x }));

    switch (this.props.settings.mapping) {
      case 'direct':
        mappingInput = (
          <Select
            options={header}
            value={this.props.settings.direct}
            updateValue={(val) => this.handleSettingsChange('direct', val)}
            label={<Popover content={directInfoContainer} target={directLabel} />}
          />
        );
        break;
      case 'script':
        mappingInput = (
          <label htmlFor="template" className="pt-label">
            <Popover
              content={scriptInfoContainer}
              target={scriptLabel}
            />
            <CodeMirror
              value={this.props.settings.script}
              onChange={(val) => this.setState({ script: val })}
              onFocusChange={(val) => {
                if (!val) this.handleSettingsChange('script', this.state.script);
              }}
              options={{
                mode: 'javascript',
                lineNumbers: true
              }}
            />
          </label>
        );
        break;
      default:
        mappingInput = (
          <label htmlFor="template" className="pt-label">
            <Popover
              content={templateInfoContainer}
              target={templateLabel}
            />
            <ColumnAutoComplete
              options={this.props.header}
              defaultValue={this.props.settings.template}
              onBlur={(val) => this.handleSettingsChange('template', val.target.value)}
            />
          </label>
        );
        break;
    }

    return (
      <div className={styles.columnForm}>
        <Select
          options={mappingOptions}
          value={this.props.settings.mapping}
          updateValue={(val) => this.handleSettingsChange('mapping', val)}
          label={<Popover content={mappingInfoContainer} target={mappingLabel} />}
        />
        {rootPathInput}
        {mappingInput}
        {dateFormat}
        <Select
          options={typeOptions}
          disabled={this.props.settings.mapping === 'date'}
          value={this.props.settings.type}
          updateValue={(val) => this.handleSettingsChange('type', val)}
          label={<Popover content={typeInfoContainer} target={typeLabel} />}
        />
        <Switch
          checked={this.props.settings.indexed}
          updateValue={(val) => this.handleSettingsChange('indexed', val)}
          label={<Popover content={indexedInfoContainer} target={indexedLabel} />}
          switch
        />
        <Switch
          checked={this.props.settings.visible}
          updateValue={(val) => this.handleSettingsChange('visible', val)}
          label={<Popover content={visibilityInfoContainer} target={visibilityLabel} />}
          switch
        />
      </div>
    );
  }
}
