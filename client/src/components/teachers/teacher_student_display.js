import React from "react";
import StudentList from "./student_list";
import AssignmentsTab from "./assignments";

class TeacherPortal extends React.Component {
  render() {
    return (
      <div>
        <h1>Teacher Portal Header</h1>
        <div className="teacher-portal-container">
          <div className="teacher left-container pull-left">
            <StudentList />
          </div>
          <div className="teacher right-container pull-right">
            <AssignmentsTab />
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
