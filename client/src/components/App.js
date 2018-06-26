import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import Header from "./header";
import TeacherStudents from "./teachers/teacher_student_display";
import StudentPortal from "./students/student_portal";
import TeacherAssignments from "./teachers/teacher_assignment_display";
import Modal from "./modal";
import NewAssignment from "./teachers/new_assignment";

import "../assets/CSS/App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Modal modalData={<NewAssignment />} />}
        <Route exact path="/*" component={Header} />
        <Link to="/teacher-portal/student-list">Student List</Link>
        <Link to="/teacher-portal/assignment-list">Assignment List</Link>
        <Link to="/student-portal">Student Portal</Link>
        <Route
          path="/teacher-portal/student-list"
          component={TeacherStudents}
        />
        <Route
          path="/teacher-portal/assignment-list"
          component={TeacherAssignments}
        />
        <Route path="/student-portal" component={StudentPortal} />
      </div>
    );
  }
}

export default App;
