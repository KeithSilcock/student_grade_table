import React from "react";
import { connect } from "react-redux";
import {
  getTeacherData,
  changeActiveClass,
  setAvailableClasses,
  setActiveStudent
} from "../../actions";
import { formatGrade, getLetterGrade } from "../../helper";

import "../../assets/CSS/teacher/roster.css";

class StudentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      highlightedStudent_id: ""
    };
  }
  async componentWillMount() {
    try {
      // await this.props.teacherLogin();
      await this.props.getTeacherData();
    } catch (err) {
      throw err;
    }
  }
  componentDidMount() {
    document.title = "Roster";
  }

  clickedStudent() {
    this.setState({
      ...this.state,
      highlightedStudent_id: true
    });
  }

  getGradeAverageFromAssignments(assignments, currentClass) {
    let count = 0;
    const average = assignments.reduce((prev, assignment) => {
      if (currentClass === assignment.class_id) {
        if (assignment.points_total === 0) {
          return prev + 0;
        }
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
    const {
      currentClass,
      setActiveStudent,
      classes,
      teacherData,
      activeStudent,
      assignments
    } = this.props;

    if (student_list) {
      var studentData = student_list.map((student, index) => {
        if (student.class_id === currentClass.class_id) {
          if (assignments[student.school_id]) {
            var gradeAverage = this.getGradeAverageFromAssignments(
              assignments[student.school_id].assignments,
              student.class_id
            );
          } else {
            var gradeAverage = 0;
          }

          const selectedStudentClass =
            activeStudent.school_id === student.school_id
              ? "selected-student"
              : "";

          return (
            <tr
              key={index}
              className={`roster data-row ${selectedStudentClass}`}
            >
              <td>
                {student.first_name} {student.last_name}
              </td>
              <td>{`${formatGrade(gradeAverage)}  ${getLetterGrade(
                gradeAverage
              )}`}</td>
              <td>
                <button
                  className="standard-button"
                  onClick={e => {
                    const studentData = {
                      firstName: student.first_name,
                      lastName: student.last_name,
                      school_id: student.school_id
                    };
                    setActiveStudent(studentData);
                  }}
                >
                  Assignments
                </button>
              </td>
            </tr>
          );
        }
      });
    }

    return (
      <div className="roster container ">
        <div className="roster header">
          <h2>Student List</h2>
        </div>
        <table className="roster table">
          <thead className="roster table-head">
            <tr>
              <th className="sortableHeader" data-sort="name">
                Student Name
                <div
                  className="arrowSegment arrowname arrowUnsorted"
                  data-sort="name"
                />
              </th>
              <th className="sortableHeader" data-sort="grade">
                Student Grade
                <div
                  className="arrowSegment arrowgrade arrowUnsorted"
                  data-sort="grade"
                />
              </th>
              <th className="roster spacer">Operations</th>
            </tr>
          </thead>
          <tbody className="roster table-body">{studentData}</tbody>
        </table>
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
    activeStudent: state.teacherData.activeStudent
  };
}

export default connect(
  mapStateToProps,
  {
    getTeacherData,
    changeActiveClass,
    setAvailableClasses,
    setActiveStudent
  }
)(StudentList);
