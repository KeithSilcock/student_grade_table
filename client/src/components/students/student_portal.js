import React from "react";
import { connect } from "react-redux";
import { getStudentData } from "../../actions";
import AssignmentsPage from "./assignments_page";
import ClassInfo from "./class_info";

import "../../assets/CSS/student/student_page.css";

class StudentPortal extends React.Component {
  componentDidMount() {
    //get starting data
    this.props.getStudentData();
    document.title = "Student Data";
  }

  render() {
    if (this.props.currentClass.class_id) {
      return (
        <div className="student-portal container">
          <div className="student-portal left">
            <ClassInfo />
          </div>
          <div className="student-portal right">
            <AssignmentsPage />
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    assignments: state.studentData.assignments,
    classes: state.studentData.classes,
    studentData: state.studentData.student_data,
    currentClass: state.teacherData.current_class
  };
}

export default connect(
  mapStateToProps,
  { getStudentData }
)(StudentPortal);
