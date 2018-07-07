import React from "react";
import { connect } from "react-redux";
import { changeScore, getTeacherData } from "../../actions";

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

  onChangeValue(e) {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      currentName: name,
      currentValue: value
    });
  }
  async onInputSubmit(e, studentData) {
    e.preventDefault();
    const { currentName, currentValue } = this.state;
    const { student_assignment_id, assignment_id } = studentData;

    const dataToSend = {
      column_name: currentName,
      column_value: currentValue,
      assignment_id,
      student_assignment_id
    };
    await changeScore(dataToSend);
    this.closeEditMode();
    this.props.getTeacherData();
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
      <form onSubmit={e => this.onInputSubmit(e, objectData)}>
        <input
          autoFocus
          size="5"
          onChange={e => this.onChangeValue(e)}
          onBlur={e => this.closeEditMode(e)}
          type="text"
          name={currentName}
          value={currentValue}
        />
      </form>
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

function mapStateToProps(state) {
  return null;
}

export default connect(
  mapStateToProps,
  { changeScore, getTeacherData }
)(DoubleClickToEdit);
