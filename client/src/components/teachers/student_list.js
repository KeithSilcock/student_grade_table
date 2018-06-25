import React from "react";
import { connect } from "react-redux";
import {
  teacherLogin,
  getTeacherData,
  changeActiveClass,
  setAvailableClasses,
  setActiveStudent
} from "../../actions";
import DropDownMenu from "../drop_down_menu";
import { formatGrade, getLetterGrade } from "../../helper";

import "../../assets/CSS/teacher_page.css";

class StudentList extends React.Component {
  async componentWillMount() {
    try {
      await this.props.teacherLogin();
      await this.props.getTeacherData();
    } catch (err) {
      throw err;
    }
  }

  getGradeAverageFromAssignments(assignments, currentClass) {
    let count = 0;
    const average = assignments.reduce((prev, assignment) => {
      if (currentClass === assignment.class_id) {
        const divisor = count ? 2 : 1;
        count++;
        return (prev + assignment.score / assignment.points_total) / divisor;
      } else {
        return prev + 0;
      }
    }, 0);
    return average;
  }

  render() {
    const { student_list } = this.props.studentData;
    const { currentClass, setActiveStudent, classes, teacherData, assignments } = this.props;

    if (student_list) {
      var studentData = student_list.map((item, index) => {
        if (item.class_id === currentClass.class_id) {
          var gradeAverage = this.getGradeAverageFromAssignments(
            assignments[item.school_id].assignments,
            item.class_id
          );
          return (
            <tr
              key={index}
              className="teacher-student-table-row"
              onClick={e => {
                const studentData = {
                  firstName: item.first_name,
                  lastName: item.last_name,
                  school_id: item.school_id
                };
                setActiveStudent(studentData);
              }}
            >
              <td>
                {item.first_name} {item.last_name}
              </td>
              <td>{`${formatGrade(gradeAverage)}  ${getLetterGrade(gradeAverage)}`}</td>
              <td>
                <button>Assignments</button>
              </td>
            </tr>
          );
        }
      });
    }

    return (
      <div>
        <DropDownMenu />
        {/* <button onClick={this.getListOfStudents.bind(this)}>GetStudents</button> */}
        <div id="dataTable" className="student-list-container form-group col-md-12 dataTable">
          <table className="student-list-container student-list table">
            <thead className="col-xs-12">
              <tr>
                <th className="sortableHeader" data-sort="name">
                  Student Name
                  <div className="arrowSegment arrowname arrowUnsorted" data-sort="name" />
                </th>
                <th className="sortableHeader" data-sort="grade">
                  Student Grade
                  <div className="arrowSegment arrowgrade arrowUnsorted" data-sort="grade" />
                </th>
                <th>Operations</th>
              </tr>
            </thead>
            <tbody className="studentTableBody col-xs-12">{studentData}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teacherData: state.teacherData.teacherData,
    assignments: state.teacherData.assignments,
    studentData: state.teacherData.student_data,
    currentClass: state.teacherData.current_class,
    classes: state.teacherData.classes,
    needsToRefresh: state.teacherData.needsToRefresh
  };
}

export default connect(
  mapStateToProps,
  {
    teacherLogin,
    getTeacherData,
    changeActiveClass,
    setAvailableClasses,
    setActiveStudent
  }
)(StudentList);
