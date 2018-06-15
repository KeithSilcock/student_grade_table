import React from "react";
import StudentList from "./student_list";
import DropDownMenu from "../drop_down_menu";

class TeacherPortal extends React.Component {
  render() {
    return (
      <div>
        <h1>Teacher Portal Header</h1>
        <DropDownMenu />
        <div className="row">
          <StudentList />
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
