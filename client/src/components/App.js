import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import TeacherHeader from "./teachers/teacher_header";
import StudentRoster from "./teachers/teacher_student_display";
import StudentPortal from "./students/student_portal";
import TeacherAssignments from "./teachers/teacher_assignment_display";
import LogIn from "./log_in";
import NewAssignment from "./teachers/new_assignment";

import "../assets/CSS/App.css";
// import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
          integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
          crossorigin="anonymous"
        />
        <Route exact path="/" component={LogIn} />
        <Route path="/teacher-portal/:location?" component={TeacherHeader} />

        <Route path="/teacher-portal/student-list" component={StudentRoster} />
        <Route
          path="/teacher-portal/assignment-list"
          component={TeacherAssignments}
        />
        <Route
          path="/teacher-portal/new-assignment"
          component={NewAssignment}
        />
        <Route path="/student-portal" component={StudentPortal} />
      </div>
    );
  }
}

export default App;
