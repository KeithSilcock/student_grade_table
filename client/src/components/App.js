import React, { Component } from "react";
import { Route, Link } from "react-router-dom";

import TeacherHeader from "./teachers/header";
import StudentHeader from "./students/student_header";
import StudentRoster from "./teachers/roster";
import StudentPortal from "./students/student_portal";
import TeacherAssignments from "./teachers/assignments";
import LogIn from "./auth/log_in";
import LogOut from "./auth/log_out";
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
        <Route exact path="/" component={LogIn} />
        <Route path="/login" component={LogIn} />
        <Route path="/logout" component={CheckLoggedIn(LogOut)} />
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
          path="/student-portal/*"
          component={CheckLoggedIn(StudentHeader)}
        />
        <Route
          path="/student-portal/classes"
          component={CheckLoggedIn(StudentPortal)}
        />
      </div>
    );
  }
}

export default App;
