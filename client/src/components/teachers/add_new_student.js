import React from "react";
import { connect } from "react-redux";
import {
  getStudentName,
  clearGotStudentName,
  addStudentToClass,
  getTeacherData,
  toggleSmallModal
} from "../../actions";
import SmallModal from "../small_modal";

import "../../assets/CSS/teacher/add_new_student.css";

class AddNewStudent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
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
      if (Object.keys(roster).length) {
        for (
          let studentIndex = 0;
          studentIndex < roster[currentClass.class_name].length;
          studentIndex++
        ) {
          const student = roster[currentClass.class_name][studentIndex];
          if (student.school_id === value) {
            shouldGetStudentName = false;
            this.setState({
              ...this.state,
              studentIsInClass: true
            });
          }
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

  toggleModal() {
    this.setState({
      student_id: "",
      studentIsInClass: false
    }),
      this.props.toggleSmallModal();
  }

  async submitNewStudent(e) {
    e.preventDefault();
    const { student_id } = this.state;
    const {
      addStudentToClass,
      newStudentName,
      currentClass,
      getTeacherData,
      toggleSmallModal
    } = this.props;
    if (newStudentName && newStudentName.first_name !== "<not found>") {
      await addStudentToClass({
        ...newStudentName,
        school_id: student_id,
        class_id: currentClass.class_id
      });
      getTeacherData();
      toggleSmallModal();
    }
  }
  escapeClose(e) {
    if (e.key === "Escape") {
      this.toggleModal();
    }
  }
  render() {
    const { displayIsOpen, student_id, studentIsInClass } = this.state;
    const { newStudentName, smallModalIsOpen } = this.props;

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
        <li className="student-name not-found">
          That student is already in this class
        </li>
      );
    } else {
      var studentNameItem = null;
    }

    const smallModalHead = "Add New Student";
    const smallModalContent = (
      <div className="add-new-student container">
        <form
          onKeyDown={e => this.escapeClose(e)}
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
        <p className="add-new-student tool-tip">Hint:</p>
        <p className="add-new-student tool-tip">
          <span className="bold">NSD908</span> to add a new student
        </p>
        <p className="add-new-student tool-tip">
          <span className="bold">ABC123</span> for an existing student
        </p>
      </div>
    );
    const smallModalConfirm = this.submitNewStudent.bind(this);

    const displayInput = smallModalIsOpen ? (
      <SmallModal
        header={smallModalHead}
        content={smallModalContent}
        confirm={smallModalConfirm}
      />
    ) : null;

    return (
      <div className="add-new-student button-container">
        {displayInput}
        <button
          className="add-new-student standard-button"
          onClick={e => this.toggleModal()}
        >
          Add new student
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.teacherData.current_class,
    newStudentName: state.teacherData.newStudentName,
    roster: state.teacherData.roster,
    smallModalIsOpen: state.navData.smallModalIsOpen
  };
}
export default connect(
  mapStateToProps,
  {
    getStudentName,
    clearGotStudentName,
    addStudentToClass,
    getTeacherData,
    toggleSmallModal
  }
)(AddNewStudent);
