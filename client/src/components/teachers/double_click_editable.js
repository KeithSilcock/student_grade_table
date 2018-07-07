import React from "react";

import "../../assets/CSS/doubleClick.css";

class DoubleClickToEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentValue: "",
      currentName: "",
      inputIsOpen: false
    };
  }
  componentDidMount() {
    const { valueName, objectData } = this.props;

    this.setState({
      ...this.state,
      currentName: valueName,
      currentValue: objectData[valueName]
    });
    this.state;
  }

  openEditMode(e) {
    const { toggleEditMode, objectData } = this.props;
    this.setState(
      {
        inputIsOpen: true
      },
      () => {
        toggleEditMode(objectData.student_id);
      }
    );
  }
  closeEditMode(e) {
    const { toggleEditMode, objectData } = this.props;
    this.setState(
      {
        inputIsOpen: false
      },
      () => {
        toggleEditMode(objectData.student_id);
      }
    );
  }
  render() {
    const { inputIsOpen, currentName, currentValue } = this.state;
    const { valueName, objectData } = this.props;

    const renderInput = inputIsOpen ? (
      <input
        autoFocus
        size="5"
        onBlur={e => this.closeEditMode(e)}
        type="text"
        name={currentName}
        value={currentValue}
      />
    ) : (
      <span>{objectData[valueName]}</span>
    );

    return (
      <div
        className="editable-container"
        onDoubleClick={e => this.openEditMode(e)}
      >
        {renderInput}
      </div>
    );
  }
}

export default DoubleClickToEdit;
