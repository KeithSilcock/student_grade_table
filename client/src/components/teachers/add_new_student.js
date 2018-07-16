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
      student_id: "",
      studentIsInClass: false
    };
  }

  changeInput(e) {
    const { studentIsInClass } = this.state;
    const { name, value } = e.target;
    const {
      getStudentName,
      clearGotStudentName,
      roster,
      currentClass
    } = this.props;
    //if length is length of student ids,
    //look for that student's name in the database and offer them
    let shouldGetStudentName = true;
    if (value.length === 6) {
      for (
        let student = 0;
        student < roster[currentClass.class_name].length;
        student++
      ) {
        const student = roster[currentClass.class_name][student];
        if (student.school_id === value) {
          shouldGetStudentName = false;
          this.setState({
            ...this.state,
            studentIsInClass: true
          });
        }
      }

      if (shouldGetStudentName) {
        getStudentName(value);
      }
    } else {
      this.setState({
        ...this.state,
        studentIsInClass: false
      });
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
      student_id: "",
      studentIsInClass: false
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
    const { displayIsOpen, student_id, studentIsInClass } = this.state;
    const { newStudentName } = this.props;

    //display students name if gotten
    if (student_id.length === 6 && newStudentName && !studentIsInClass) {
      if (newStudentName.first_name !== "<not found>") {
        var studentNameItem = (
          <li onClick={e => this.submitNewStudent(e)} className="student-name">
            <div className="inner-student-name">
              {`${newStudentName.first_name} ${newStudentName.last_name}`}
            </div>
          </li>
        );
      } else {
        var studentNameItem = (
          <li className="student-name not-found">No Student Found</li>
        );
      }
    } else if (studentIsInClass) {
      var studentNameItem = (
        <li className="student-name not-found">That student already exists</li>
      );
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
        <button
          className="add-new-student-tab-button"
          onClick={e => this.toggleInput(e)}
        >
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
    newStudentName: state.teacherData.newStudentName,
    roster: state.teacherData.roster
  };
}
export default connect(
  mapStateToProps,
  { getStudentName, clearGotStudentName, addStudentToClass, getTeacherData }
)(AddNewStudent);
