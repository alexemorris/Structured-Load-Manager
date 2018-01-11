import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, VirtualTableView, TableHeaderRow
} from '@devexpress/dx-react-grid-bootstrap3';

import {
  DataTypeProvider, TableColumnResizing
} from '@devexpress/dx-react-grid';

import DateFormatter from '../../renderers/DateFormatter';
import FileTypeFormatter from '../../renderers/FileTypeFormatter';
import BoolFormatter from '../../renderers/BoolFormatter';

export default class PreviewTable extends React.PureComponent {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    rows: PropTypes.arrayOf(PropTypes.object),
    height: PropTypes.number.isRequired,
    widths: PropTypes.object,
    changeNodeSettings: PropTypes.func.isRequired
  };

  static defaultProps = {
    columns: [],
    rows: [],
    widths: {},
    changeNodeSettings: () => null
  }

  changeColumnWidths(newWidths) {
    Object.keys(newWidths).forEach(uuid => {
      if (this.props.widths[uuid] !== newWidths[uuid]) {
        this.props.changeNodeSettings([], uuid, { width: newWidths[uuid] });
      }
    });
  }

  render() {
    return (
      <div>
        <Grid rows={this.props.rows} columns={this.props.columns}>
          <VirtualTableView height={this.props.height}/>
          <TableColumnResizing
            defaultColumnWidths={this.props.widths}
            onColumnWidthsChange={this.changeColumnWidths.bind(this)}
          />
          <TableHeaderRow allowResizing />
          <DataTypeProvider
            type="date"
            formatterTemplate={({ value }) => <DateFormatter value={value} />}
          />
          <DataTypeProvider
            type="filetype"
            formatterTemplate={({ value }) => <FileTypeFormatter value={value} />}
          />
          <DataTypeProvider
            type="bool"
            formatterTemplate={({ value }) => <BoolFormatter value={value} />}
          />
        </Grid>
      </div>
    );
  }

}
