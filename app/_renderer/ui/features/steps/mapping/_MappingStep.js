import * as React from 'react';
import Select from '../../shared/form/Select';
import MappingDescription from './_MappingDescription';
import styles from './_MappingStep.scss';

const MappingStep = (props) => (
  <div className={styles.mappingContainer}>
    <div className={styles.mapping}>
      <div className={styles.mappingItem}>
        <MappingDescription name="UUID" required description="Unique identifier. This column must be fully unique or you will run into problems. Use the generated line number or guid if you're not sure" />
        <Select options={props.uuidColumns} value={props.mapping.uuid} updateValue={(value) => props.setMapping('uuid', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Parent" required description="Parent identifier (use the UUID if this doesn't exist)" />
        <Select options={props.uuidColumns} value={props.mapping.parent} updateValue={(value) => props.setMapping('parent', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Visibility" description="Boolean field to determine whether item is visible. Leave blank if you dont want to hide any items from the bundle GUI." />
        <Select options={props.boolColumns} value={props.mapping.visible} updateValue={(value) => props.setMapping('visible', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Native Link" required description="Relative link to native file. Required." />
        <Select options={props.columns} value={props.mapping.native} updateValue={(value) => props.setMapping('native', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Text Link" description="Relative link to text file. Required." />
        <Select options={props.columns} value={props.mapping.text} updateValue={(value) => props.setMapping('text', value)} />
      </div>
      {/* <div className={styles.mappingItem}>
        <h1>Thumbnail Path</h1>
        <Select options={props.columns} value={props.mapping.thumb} updateValue={(value) => props.setMapping('thumb', value)} />
      </div> */}
      <div className={styles.mappingItem}>
        <MappingDescription name="Document Title" required description="Document title, will be used in search results and in sidebar for ebundle viewer and filenames" />
        <Select options={props.columns} value={props.mapping.title} updateValue={(value) => props.setMapping('title', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Document Description" required description="Document description, will be used in search results and in sidebar for ebundle viewer" />
        <Select options={props.columns} value={props.mapping.description} updateValue={(value) => props.setMapping('description', value)} />
      </div>
      <div className={styles.mappingItem}>
        <MappingDescription name="Document Date" description="Document date, not required, will be used in search results" />
        <Select options={props.dateColumns} value={props.mapping.date} updateValue={(value) => props.setMapping('date', value)} />
      </div>
    </div>
  </div>
);

export default MappingStep;
