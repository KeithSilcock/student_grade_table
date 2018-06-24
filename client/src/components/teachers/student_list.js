import React from "react";
import { connect } from "react-redux";
import { teacherLogin, changeActiveClass, setAvailableClasses, setActiveStudent } from "../../actions";
import DropDownMenu from "../drop_down_menu";
import { formatGrade, getLetterGrade } from "../../helper";

import "../../assets/CSS/teacher_page.css";

class StudentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teacherData: {},
      assignments: {}
    };
  }

  async componentWillMount() {
    try {
      await this.props.teacherLogin();
      if (Object.keys(this.props.studentData).length) {
        this.formatTeacherData();
      }
    } catch (err) {
      throw err;
    }
  }

  formatTeacherData() {
    const { assignment_list, class_list, student_list } = this.props.studentData;
    const { setAvailableClasses } = this.props;
    // get all classes, assignments, and grades data formated

    const teacherData = {};
    // get all class data (and add the current teacher's data)
    const classes = class_list.reduce((initObject, classInfo) => {
      teacherData.first_name = classInfo.first_name;
      teacherData.last_name = classInfo.last_name;

      const classObj = {
        [classInfo.class_name]: {
          class_description: classInfo.description,
          class_id: classInfo.class_id
        }
      };

      return Object.assign(initObject, classObj);
    }, {});

    //get assignment data per student
    const studentAssignments = {};
    for (let index = 0; index < assignment_list.length; index++) {
      const assignment = assignment_list[index];
      try {
        var existingArray = studentAssignments[assignment.student_id].assignments;
      } catch (err) {
        if (err.constructor == TypeError) {
          existingArray = [];
        } else {
          throw err;
        }
      }

      //formatting data
      studentAssignments[assignment.student_id] = {
        assignments: [...existingArray, assignment]
      };
    }

    this.setState({
      teacherData,
      assignments: studentAssignments
    });
    setAvailableClasses(classes);
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

  // removeActiveStudentOnClassChange(a, b) {
  //   const { changeActiveClass, clickStudent } = this.props;
  //   changeActiveClass(a, b);
  //   clickStudent({});
  // }

  render() {
    const { teacherData, assignments } = this.state;
    const { student_list } = this.props.studentData;
    const { currentClass, setActiveStudent, classes } = this.props;

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
    studentData: state.studentData.student_data,
    currentClass: state.assignmentList.current_class,
    classes: state.availableClasses.classes
  };
}

export default connect(
  mapStateToProps,
  { teacherLogin, changeActiveClass, setAvailableClasses, setActiveStudent }
)(StudentList);
