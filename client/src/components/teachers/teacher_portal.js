import React from "react";
import StudentList from "./student_list";

class TeacherPortal extends React.Component {
  render() {
    return (
      <div>
        <h1>Teacher Portal Header</h1>
        <div className="row">
          <StudentList />
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
