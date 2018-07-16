import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import TeacherHeader from "./teachers/teacher_header";
import StudentRoster from "./teachers/teacher_student_display";
import StudentPortal from "./students/student_portal";
import TeacherAssignments from "./teachers/teacher_assignment_display";
import LogIn from "./log_in";
import LogOut from "./log_out";
import NewAssignment from "./teachers/new_assignment";
import CheckLoggedIn from "./HOC/logged_in";

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
          crossOrigin="anonymous"
        />
        <Route exact path="/login" component={LogIn} />
        <Route exact path="/logout" component={CheckLoggedIn(LogOut)} />
        <Route
          path="/teacher-portal/*"
          component={CheckLoggedIn(TeacherHeader)}
        />

        <Route
          path="/teacher-portal/student-list"
          component={CheckLoggedIn(StudentRoster)}
        />
        <Route
          path="/teacher-portal/assignment-list"
          component={CheckLoggedIn(TeacherAssignments)}
        />
        <Route
          path="/teacher-portal/new-assignment"
          component={CheckLoggedIn(NewAssignment)}
        />
        <Route
          path="/student-portal"
          component={CheckLoggedIn(StudentPortal)}
        />
      </div>
    );
  }
}

export default App;
