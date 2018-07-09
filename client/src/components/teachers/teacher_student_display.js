import React from "react";
import StudentList from "./student_list";
import AssignmentsTab from "./assignments";

import "../../assets/CSS/teacher_portal.css";

class TeacherPortal extends React.Component {
  render() {
    return (
      <div className="teacher-portal container">
        <div className="teacher-portal left-container">
          <StudentList />
        </div>
        <div className="teacher-portal right-container">
          <AssignmentsTab />
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
