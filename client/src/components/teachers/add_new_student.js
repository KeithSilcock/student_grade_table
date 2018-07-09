import React from "react";
import { connect } from "react-redux";
import {
  getStudentName,
  clearGotStudentName,
  addStudentToClass,
  getTeacherData
} from "../../actions";

import "../../assets/CSS/add_new_student.css";

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
    const { getStudentName, clearGotStudentName } = this.props;
    //if length is length of student ids,
    //look for that student's name in the database and offer them
    if (value.length === 6) {
      getStudentName(value);
    } else {
      clearGotStudentName();
    }

    this.setState({
      [name]: value
    });
  }
  toggleInput(e) {
    const { displayIsOpen } = this.state;
    this.setState({
      ...this.state,
      displayIsOpen: !displayIsOpen,
      student_id: ""
    });
    clearGotStudentName();
  }

  async submitNewStudent(e) {
    //To Do: Add effect for confirmation
    e.preventDefault();
    const { student_id } = this.state;
    const {
      addStudentToClass,
      newStudentName,
      currentClass,
      getTeacherData
    } = this.props;

    await addStudentToClass({
      ...newStudentName,
      school_id: student_id,
      class_id: currentClass.class_id
    });
    getTeacherData();
    this.toggleInput();
  }
  render() {
    const { displayIsOpen, student_id } = this.state;
    const { newStudentName } = this.props;

    if (student_id.length === 6 && newStudentName) {
      if (newStudentName.first_name !== "<not found>") {
        var studentNameItem = (
          <li className="student-name">{`${newStudentName.first_name} ${
            newStudentName.last_name
          }`}</li>
        );
      } else {
        var studentNameItem = (
          <li className="student-name not-found">No Student Found</li>
        );
      }
    } else {
      var studentNameItem = null;
    }

    const displayInput = displayIsOpen ? (
      <div className="add-new-student input-container">
        <form
          onSubmit={e => {
            this.submitNewStudent(e);
          }}
        >
          <input
            className="add-new-student input"
            name="student_id"
            autoFocus
            onChange={e => {
              this.changeInput(e);
            }}
            value={student_id}
            type="text"
          />
          <ul className="add-new-student student-name-list">
            {studentNameItem}
          </ul>
        </form>
      </div>
    ) : null;

    return (
      <div className="add-new-student add-new-student-container">
        <button className="standard-button" onClick={e => this.toggleInput(e)}>
          Add new student
        </button>
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
  { getStudentName, clearGotStudentName, addStudentToClass, getTeacherData }
)(AddNewStudent);
