import React, { Component } from "react";
import Header from "./header";
import { Route, Link } from "react-router-dom";
import TeacherPortal from "./teachers/teacher_portal";
import StudentPortal from "./students/student_portal";

import "./App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Route exact path="/" component={Header} />
        <Link to="/teacher-portal">Teacher Portal</Link>
        <Link to="/student-portal">Student Portal</Link>

        <Route path="/teacher-portal" component={TeacherPortal} />
        <Route path="/student-portal" component={StudentPortal} />
      </div>
    );
  }
}

export default App;
