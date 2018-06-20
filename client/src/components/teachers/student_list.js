import React from "react";
import { connect } from "react-redux";
import { teacherLogin, changeActiveClass } from "../../actions";
import DropDownMenu from "../drop_down_menu";
import { formatGrade, getLetterGrade } from "../../helper";

import "../../assets/CSS/teacher_page.css";

class StudentList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: {},
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

    //get assignment data and calc average grade per student
    const studentAssignments = {};
    for (let index = 0; index < assignment_list.length; index++) {
      const assignment = assignment_list[index];

      try {
        var existingArray = studentAssignments[assignment.school_id].assignments;
        var existingGradeAvg = studentAssignments[assignment.school_id].gradeAverage;
        var skipAdd = false;
      } catch (err) {
        if (err.constructor == TypeError) {
          existingArray = [];
          existingGradeAvg = 0;
          skipAdd = true;
        } else {
          throw err;
        }
      }

      //formatting data
      studentAssignments[assignment.school_id] = {
        assignments: [
          ...existingArray,
          {
            assignment_id: assignment.id,
            class_id: assignment.class_id,
            assignment_name: assignment.assignment_name,
            score: assignment.score,
            pointsTotal: assignment.points_total,
            comments: assignment.comments
          }
        ],
        gradeAverage: (existingGradeAvg + assignment.score / assignment.points_total) / (skipAdd ? 1 : 2)
      };
    }

    this.setState({
      classes,
      teacherData,
      assignments: studentAssignments
    });
  }

  // changeClass(class_name, class_id) {
  //   console.log("changing class to: ", class_id);
  //   this.setState({
  //     currentClass: {
  //       class_name,
  //       class_id
  //     }
  //   });
  // }

  render() {
    const { classes, teacherData, assignments } = this.state;
    const { student_list } = this.props.studentData;
    const { currentClass, changeActiveClass, clickStudent } = this.props;

    if (student_list) {
      var studentData = student_list.map((item, index) => {
        if (item.class_id === currentClass.class_id) {
          try {
            var gradeAverage = assignments[item.school_id].gradeAverage;
          } catch (err) {
            gradeAverage = 0;
          }
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
                clickStudent(studentData);
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

    // const studentData = student_list.map((item, index) => {
    //   if (item.class_id === currentClass)
    //     return (
    //       <tr key={index}>
    //         <td>
    //           {item.first_name} {item.last_name}
    //         </td>
    //         <td>{item.class_name}</td>
    //         <td>{item.grade}</td>
    //       </tr>
    //     );
    // });

    return (
      <div>
        <DropDownMenu
          dropDownContents={classes}
          changeClass={changeActiveClass}
          currentClass={currentClass}
        />
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
    currentClass: state.assignmentList.current_class
  };
}

export default connect(
  mapStateToProps,
  { teacherLogin, changeActiveClass }
)(StudentList);
