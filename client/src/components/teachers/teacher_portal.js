import React from "react";
import StudentList from "./student_list";
import AssignmentsTab from "./assignments";

class TeacherPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      clickedStudent: {}
    };
  }

  handleClickedStudent(clickedStudent) {
    console.log(clickedStudent);
    this.setState({
      ...this.state,
      clickedStudent
    });
  }

  render() {
    const { clickedStudent } = this.state;
    return (
      <div>
        <h1>Teacher Portal Header</h1>
        <div className="teacher-portal-container">
          <div className="teacher left-container pull-left">
            <StudentList clickStudent={this.handleClickedStudent.bind(this)} />
          </div>
          <div className="teacher right-container pull-right">
            <AssignmentsTab activeStudent={clickedStudent} />
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
