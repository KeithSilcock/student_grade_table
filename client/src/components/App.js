import React, { Component } from "react";
import Header from "./header";
import StudentPage from "./students";
import Assignments from "./students/assignments_page";
import StudentList from "./teachers/student_list";
import AddStudent from "./teachers/add_student";
import "./App.css";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    hey => {};
    return (
      <div className="App">
        {/*<StudentPage />*/}
        <Header />
        {/* <Assignments /> */}
        <div className="row">
          <StudentList />
          {/*<AddStudent />*/}
        </div>
      </div>
    );
  }
}

export default App;
