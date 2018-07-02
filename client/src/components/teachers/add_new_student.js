import React from "react";
import { connect } from "react-redux";
import { getStudentName } from "../../actions";

class AddNewStudent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayIsOpen: false,
      student_id: ""
    };
  }

  changeInput(e) {
    const { name, value } = e.target;

    //if length is length of student ids,
    //look for that student's name in the database and offer them
    if (value.length === 6) {
      getStudentName();
    }

    this.setState({
      [name]: value
    });
  }
  toggleInput(e) {
    const { displayIsOpen } = this.state;
    this.setState({
      ...this.state,
      displayIsOpen: !displayIsOpen
    });
  }

  submitNewStudent(e) {
    e.preventDefault();

    debugger;
  }
  render() {
    const { displayIsOpen } = this.state;
    const { newStudentName } = this.props;
    const studentNameItem = newStudentName ? (
      <li className="student-name">{newStudentName}</li>
    ) : null;

    const displayInput = displayIsOpen ? (
      <div className="add-new-student input-container">
        <form
          onSubmit={e => {
            this.submitNewStudent(e);
          }}
        >
          <input
            name="student_id"
            onChange={e => {
              this.changeInput(e);
            }}
            type="text"
          />
          <ul className="add-new-student student-name-list">
            {studentNameItem}
          </ul>
        </form>
      </div>
    ) : null;
    return (
      <div className="add-new-student container">
        <button onClick={e => this.toggleInput(e)}>Add new student</button>
        {displayInput}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.teacherData.current_class,
    newStudentName: state.teacherData.newStudentName
  };
}
export default connect(
  mapStateToProps,
  { getStudentName }
)(AddNewStudent);
