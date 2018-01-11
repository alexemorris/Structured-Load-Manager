import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PasswordValidator from 'password-validator';
import { ProgressBar, AnchorButton } from '@blueprintjs/core';
import Input from '../../shared/form/Input';
import TextArea from '../../shared/form/TextArea';
import styles from './_PackageStep.scss';


const schema = new PasswordValidator();
schema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits()
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(['Passw0rd', 'Password123', 'P@55w0rd!', 'P@55w0rd', '']);

export default class PackageStep extends Component {

  static propTypes = {
    output: PropTypes.string,
    error: PropTypes.string,
    progress: PropTypes.number,
    complete: PropTypes.bool,
    message: PropTypes.string.isRequired,
    encrypted: PropTypes.bool.isRequired,
    startPackaging: PropTypes.func.isRequired,
    settings: PropTypes.shape({
      title: PropTypes.string,
      author: PropTypes.string,
      version: PropTypes.string,
      description: PropTypes.string,
      applicants: PropTypes.string,
      authority: PropTypes.string,
      reference: PropTypes.string
    }).isRequired,
    setPackagingSetting: PropTypes.func.isRequired
  }

  static defaultProps = {
    output: null,
    error: null,
    progress: 0,
    complete: false
  }

  constructor(props) {
    super(props);
    this.state = {
      pass1: '',
      pass2: ''
    };
  }

  changeSettings(column, value) {
    if (this.props.settings[column] !== value) {
      this.props.setPackagingSetting(column, value);
    }
  }

  render() {
    if (this.props.error) {
      return (
        <div className={styles.package}>
          <div className={styles.mainContent}>
            <i className="fa fa-warning" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Problem packaging</h2>
              <p>{this.props.error}</p>
            </div>
          </div>
        </div>
      );
    } else if (this.props.complete) {
      return (
        <div className={styles.package}>
          <div className={styles.mainContent}>
            <i className="fa fa-check" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Packaging Complete</h2>
              <p>{`See output at ${this.props.output}`}</p>
            </div>
          </div>
        </div>
      );
    } else if (this.props.progress > 0 && !this.props.encrypted) {
      return (
        <div className={styles.package}>
          <div className={styles.mainContent}>
            <i className="fa fa-cog fa-spin" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Encrypting</h2>
              <p>{this.props.message}</p>
              <ProgressBar value={this.props.progress} intent="primary" />
            </div>
          </div>
        </div>
      );
    } else if (this.props.encrypted) {
      return (
        <div className={styles.package}>
          <div className={styles.mainContent}>
            <i className="fa fa-spinner fa-pulse" aria-hidden="true" />
            <div className={styles.instructions}>
              <h2>Packaging</h2>
            </div>
          </div>
        </div>
      );
    }
    const validate = schema.validate(this.state.pass1, { list: true });
    return (
      <div className={styles.package}>
        <div className={styles.formContent}>
          <i className="fa fa-archive" aria-hidden="true" onClick={() => this.props.startPackaging('test')} />
          <div className={styles.instructions}>
            <Input
              value={this.props.settings.title}
              updateValue={(val) => this.changeSettings('title', val)}
              label="Title"
            />
            <Input
              value={this.props.settings.author}
              updateValue={(val) => this.changeSettings('author', val)}
              label="Author"
            />
            <Input
              value={this.props.settings.reference}
              updateValue={(val) => this.changeSettings('reference', val)}
              label="Reference"
            />
            <Input
              value={this.props.settings.applicants}
              updateValue={(val) => this.changeSettings('applicants', val)}
              label="Applicants"
            />
            <Input
              value={this.props.settings.authority}
              updateValue={(val) => this.changeSettings('authority', val)}
              label="Authority"
            />
            <TextArea
              value={this.props.settings.description}
              updateValue={(val) => this.changeSettings('description', val)}
              label="Description"
            />
            <Input
              value={this.state.pass1}
              updateValue={(val) => this.setState({ pass1: val })}
              type="password"
              label="Type Password"
            />
            <Input
              value={this.state.pass2}
              updateValue={(val) => this.setState({ pass2: val })}
              type="password"
              label="Retype Password"
            />
            <div>
              <ul className={styles.passwordValidation}>
                <li>Passwords must match <i className={`fa fa-${this.state.pass1 === this.state.pass2 && this.state.pass1 !== '' ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Passwords must be more than 6 characters <i className={`fa fa-${validate.indexOf('min') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Passwords must contain 1 uppercase letter <i className={`fa fa-${validate.indexOf('uppercase') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Passwords must contain 1 lowercase letter <i className={`fa fa-${validate.indexOf('lowercase') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Passwords must contain a digit <i className={`fa fa-${validate.indexOf('digits') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Does not contain spaces <i className={`fa fa-${validate.indexOf('spaces') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
                <li>Passwords must not be blacklisted <i className={`fa fa-${validate.indexOf('oneOf') === -1 ? 'check' : 'close'}`} aria-hidden="true" /></li>
              </ul>
            </div>
            <AnchorButton
              disabled={validate.length || this.state.pass1 !== this.state.pass2}
              onClick={() => {
                if (this.state.pass1 === this.state.pass2) {
                  this.props.startPackaging(this.state.pass1);
                }
              }}
            >
              Start Packaging
            </AnchorButton>
          </div>
        </div>
      </div>
    );
  }
}
