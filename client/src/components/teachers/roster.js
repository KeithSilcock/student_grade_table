import React from "react";
import StudentList from "./roster_list";
import AssignmentsTab from "./roster_assignments";

import "../../assets/CSS/teacher/teacher_portal.css";

class TeacherRoster extends React.Component {
  render() {
    return (
      <div className="teacher-portal container">
        <div className="teacher-portal left-container">
          <StudentList />
        </div>
        <div className="teacher-portal right-container">
          <AssignmentsTab {...this.props} />
        </div>
      </div>
    );
  }
}

export default TeacherRoster;
