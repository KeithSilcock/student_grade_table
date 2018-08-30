import React from "react";
import { connect } from "react-redux";
import { changeScore, getTeacherData } from "../../actions";

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

  componentWillReceiveProps(nextProps) {
    const { valueName, objectData } = nextProps;
    const { objectData: prevObjectData } = this.props;

    if (JSON.stringify(objectData) !== JSON.stringify(prevObjectData)) {
      this.setState({
        ...this.state,
        currentName: valueName,
        currentValue: objectData[valueName]
      });
    }
  }

  closeInputOnEscape(e) {
    if (e.key === "Escape") {
      this.closeEditMode();
    }
  }

  onChangeValue(e) {
    const { name, value } = e.target;
    debugger;
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
        if (toggleEditMode) toggleEditMode(objectData.student_id);
      }
    );
  }
  closeEditMode(e) {
    const { toggleEditMode, objectData, valueName } = this.props;
    this.setState(
      {
        inputIsOpen: false
      },
      () => {
        if (toggleEditMode) toggleEditMode(objectData.student_id);
      }
    );
  }
  render() {
    const { inputIsOpen, currentName, currentValue } = this.state;
    const { valueName, objectData, inputSize, type } = this.props;

    const renderInput = inputIsOpen ? (
      <div className="form-container">
        <form
          className="editable-form"
          onSubmit={e => this.onInputSubmit(e, objectData)}
        >
          <input
            onKeyDown={e => this.closeInputOnEscape(e)}
            className="editable-input"
            autoFocus={true}
            onFocus={e => e.target.select()}
            size={inputSize}
            onChange={e => {
              this.onChangeValue(e);
            }}
            onBlur={e => this.closeEditMode(e)}
            type={type}
            name={currentName}
            value={currentValue}
          />
        </form>
        <span className="editable-span">{objectData[valueName]}</span>
      </div>
    ) : (
      <span className="editable-span">{objectData[valueName]}</span>
    );

    return (
      <div
        className="editable-container"
        onClick={e => {
          e.stopPropagation();
          this.openEditMode(e);
        }}
      >
        {renderInput}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  { changeScore, getTeacherData }
)(DoubleClickToEdit);
