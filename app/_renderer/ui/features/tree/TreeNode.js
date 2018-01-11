import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { EditableText, Collapse } from '@blueprintjs/core';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';

import styles from './TreeNode.scss';

const SortableItem = SortableElement(({ passdown }) => (
  <Node
    {...passdown}
  />
));


const SortableList = SortableContainer(({ nodes, actions }) => (
  <div className={styles.sortableColumns}>
    {nodes.map((node, index) => {
      const passdown = {
        ...actions,
        ...node
      };
      return (
        <SortableItem key={`node-${node.uuid}`} index={index} passdown={passdown} />
      );
    })}
  </div>
));

class Node extends Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    indent: PropTypes.number,
    name: PropTypes.string,
    settings: PropTypes.object,
    visible: PropTypes.bool,
    expanded: PropTypes.bool,
    settingsExpanded: PropTypes.bool,
    parents: PropTypes.arrayOf(PropTypes.string),
    active: PropTypes.arrayOf(PropTypes.string),
    form: PropTypes.func,
    changeNode: PropTypes.func,
    addNode: PropTypes.func,
    removeNode: PropTypes.func,
    changeNodeSettings: PropTypes.func,
    selectNode: PropTypes.func,
    settingsIcon: PropTypes.string,
    maxDepth: PropTypes.number
  }

  static defaultProps = {
    name: '',
    nodes: [],
    indent: 0,
    expanded: false,
    visible: false,
    settings: {},
    settingsExpanded: false,
    children: null,
    active: [],
    parents: [],
    settingsIcon: 'fa-cog',
    maxDepth: 1,
    form: () => null,
    changeNode: () => null,
    selectNode: () => null,
    changeNodeSettings: () => null,
    reorderNode: () => null,
    removeNode: () => null,
    addNode: () => null
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleChange(key) {
    return (value) => this.props.changeNode(this.props.parents, this.props.uuid, key, value);
  }

  handleSettingsChange({ submittedValues }) {
    this.props.changeNodeSettings(this.props.parents, this.props.uuid, submittedValues);
  }

  handleDelete() {
    this.props.removeNode(this.props.parents, this.props.uuid);
  }

  handleSelect() {
    this.props.selectNode([...this.props.parents, this.props.uuid]);
  }

  handleAdd() {
    this.props.addNode([...this.props.parents, this.props.uuid]);
    this.handleChange('expanded')(true);
  }

  toggleExpanded() {
    this.handleChange('expanded')(!this.props.expanded);
  }

  toggleSettingsExpanded() {
    this.setState({ expanded: !this.state.expanded });

    // this.handleChange('settingsExpanded')(!this.props.settingsExpanded);
  }

  render() {
    const { ...passdown } = this.props;
    const tree = (
      <TreeNode
        {...passdown}
        indent={this.props.indent + 1}
        parents={[...this.props.parents, this.props.uuid]}
      />
    );

    let active = '';

    if (this.props.active && this.props.active.reverse()[0] === this.props.uuid) {
      active = styles.activeRoot;
    } else if (this.props.active && this.props.active.indexOf(this.props.uuid) !== -1) {
      active = styles.activeBranch;
    }

    const DragHandle = SortableHandle(() => <i className="fa fa-bars" />); // This can be any component you want

    const add = this.props.indent < (this.props.maxDepth - 1) ?
      (
        <i className="fa fa-plus" onClick={this.handleAdd.bind(this)} />
      ) : null;

    const toggle = this.props.indent < (this.props.maxDepth - 1) && this.props.nodes.length ? (
      <i
        className="fa fa-chevron-down"
        onClick={this.toggleExpanded.bind(this)}
        style={{
          transform: this.props.expanded ? 'rotate(180deg)' : 'rotate(0)'
        }}
      />
    ) : null;
    return (
      <div>
        <div className={`${styles.node} ${active}`}>
          <div className={styles.nodeInfo} >

            <div className={styles.nodeIcons}>
              {toggle}
                <i className={`fa ${this.props.settingsIcon}`} onClick={this.toggleSettingsExpanded.bind(this)}/>
                <i className="fa fa-eye" onClick={this.handleSelect.bind(this)} />
                <i className="fa fa-trash" onClick={this.handleDelete.bind(this)} />
              {add}
              <DragHandle />
            </div>
            <div className={styles.nodeFormContainer}>
              <div className={styles.nodeForm}>
                <EditableText
                  onChange={this.handleChange('name').bind(this)}
                  value={this.props.name}
                  className={styles.titleEdit}
                />
                <Collapse isOpen={this.state.expanded}>
                  <div className={styles.nodeSettings}>
                    {this.props.form({
                      changeNodeSettings: this.handleSettingsChange.bind(this),
                      settings: this.props.settings,
                      uuid: this.props.uuid
                    })}
                  </div>
                </Collapse>
              </div>
            </div>
          </div>
        </div>
        <Collapse isOpen={this.props.expanded}>
          {tree}
        </Collapse>
      </div>
    );
  }
}

const TreeNode = (props) => {
  const style = {
    marginLeft: `${props.indent > 0 ? 50 : 0}px`,
  };

  const handleSort = (event) => {
    props.reorderNode(props.parents, event.oldIndex, event.newIndex);
  };

  const { nodes, ...passdown } = props;

  return (
    <div className={styles.treeContainer} style={style} >
      <SortableList
        nodes={props.nodes}
        actions={{ ...passdown }}
        onSortEnd={handleSort}
        useDragHandle
      />
    </div>
  );
};


TreeNode.propTypes = {
  nodes: PropTypes.arrayOf(PropTypes.object),
  parents: PropTypes.arrayOf(PropTypes.string),
  indent: PropTypes.number,
  reorderNode: PropTypes.func.isRequired,
};

TreeNode.defaultProps = {
  nodes: [],
  parents: [],
  indent: 0,
  uuid: undefined
};

export default TreeNode;
