import React from 'react';
import SimpleFormatter from './SimpleFormatter';
import Icon from './Icon';
import styles from './FileTypeFormatter.css'

export default class FileTypeFormatter extends SimpleFormatter {
  render() {
    let icon;
    switch (this.props.value.toLowerCase()) {
      case '.pdf':
        icon = <Icon name="fa-file-pdf-o" color="#c1281c" />;
        break;
      case '.ppt':
        icon = <Icon name="fa-file-powerpoint-o" color="#c1621c" />;
        break;
      case '.pptx':
        icon = <Icon name="fa-file-powerpoint-o" color="#c1621c" />;
        break;
      case '.xls':
        icon = <Icon name="fa-file-excel-o" color="#229c2e" />;
        break;
      case '.xlsx':
        icon = <Icon name="fa-file-excel-o" color="#229c2e" />;
        break;
      case '.xlsb':
        icon = <Icon name="fa-file-excel-o" color="#229c2e" />;
        break;
      case '.csv':
        icon = <Icon name="fa-file-text-o" color="#229c2e" />;
        break;
      case '.doc':
        icon = <Icon name="fa-file-word-o" color="#2187ce" />;
        break;
      case '.docx':
        icon = <Icon name="fa-file-word-o" color="#2187ce" />;
        break;
      case '.wav':
        icon = <Icon name="fa-file-audio-o" color="#c23b8e" />;
        break;
      case '.mp3':
        icon = <Icon name="fa-file-audio-o" color="#c23b8e" />;
        break;
      case '.jpg':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.jpeg':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.png':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.gif':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.bmp':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.tif':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.tiff':
        icon = <Icon name="fa-file-image-o" color="#c23b8e" />;
        break;
      case '.txt':
        icon = <Icon name="fa-file-text-o" color="#000" />;
        break;
      case '.rtf':
        icon = <Icon name="fa-file-text-o" color="#666" />;
        break;
      case '.mail':
        icon = <Icon name="fa-envelope-o" color="#edb100" />;
        break;
      case '.msg':
        icon = <Icon name="fa-envelope-o" color="#edb100" />;
        break;
      case '.eml':
        icon = <Icon name="fa-envelope-o" color="#edb100" />;
        break;
      case '.avi':
        icon = <Icon name="fa-film" />;
        break;
      case '.mov':
        icon = <Icon name="fa-film" color="#2187ce" />;
        break;
      default:
        icon = <Icon name="fa-file-o" color="#000" />;
        break;
    }

    return (
      <div title={this.props.value} className={styles.iconContainer}>{icon}</div>
    );
  }
}
