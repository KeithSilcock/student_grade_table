import React, { Fragment } from "react";
import { connect } from "react-redux";
import {
  teacherLogin,
  getTeacherData,
  toggleModal,
  deleteAssignment
} from "../../actions";
import DropDownMenu from "../drop_down_menu";

import "../../assets/CSS/assignment-list.css";

//TODO fix issue where adding new assignment doesn't keep their
// points total (if added at the top)

class TeacherAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableAssignments: {}
    };
  }

  async componentWillMount() {
    try {
      await this.props.teacherLogin();
      await this.props.getTeacherData();
    } catch (err) {
      throw err;
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      studentData: { assignment_list },
      currentClass
    } = nextProps;

    const availableAssignments = {};
    if (assignment_list) {
      for (
        let assignmentIndex = 0;
        assignmentIndex < assignment_list.length;
        assignmentIndex++
      ) {
        const assignment = assignment_list[assignmentIndex];
        if (assignment.class_id === currentClass.class_id) {
          availableAssignments[assignment.assignment_id] = assignment;
        }
      }
    }
    this.setState({
      ...this.state,
      availableAssignments
    });
  }

  render() {
    const { availableAssignments } = this.state;
    const {
      currentClass,
      studentData: { student_list },
      assignments,
      toggleModal,
      deleteAssignment,
      getTeacherData
    } = this.props;

    //get all headers
    if (currentClass.class_name) {
      var renderAssignmentHeaders = Object.keys(availableAssignments).map(
        (assignment_id, index) => {
          const assignment = availableAssignments[assignment_id];
          return (
            <Fragment key={index}>
              <th
                className="assignment-list sortableHeader"
                data-sort={assignment.assignment_name}
              >
                <div className="assignment-list assignment-header">
                  <span>{assignment.assignment_name}</span>
                  <div
                    className="assignment-list delete"
                    onClick={e => {
                      deleteAssignment(assignment_id);
                      getTeacherData();
                    }}
                  >
                    <span>&times;</span>
                  </div>
                </div>
              </th>
            </Fragment>
          );
        }
      );
    }

    //get all student grades
    if (currentClass.class_name) {
      var students_assignment_data = student_list.map((student, index1) => {
        if (student.class_id === currentClass.class_id) {
          if (assignments[student.school_id]) {
            var assignment_row_data = assignments[
              student.school_id
            ].assignments.map((assignment, index2) => {
              if (currentClass.class_id === assignment.class_id) {
                const redZeroClass = assignment.points_total ? "" : "red-zero";
                return (
                  <td key={index2}>
                    <span>{assignment.score}</span>/<span
                      className={redZeroClass}
                    >
                      {assignment.points_total}
                    </span>
                  </td>
                );
              }
            });
          } else {
            var assignment_row_data = Object.keys(availableAssignments).map(
              (assignment_id, index, array) => {
                //need to add onclick that will allow for edit
                return (
                  <td>
                    {0}/{0}
                  </td>
                );
              }
            );
          }
          return (
            <tr key={index1}>
              <td>
                {student.first_name} {student.last_name}
              </td>
              {assignment_row_data}
            </tr>
          );
        }
      });
    }

    return (
      <div className="assignment-list-container">
        <div className="assignment-list head">
          <DropDownMenu />
        </div>
        <div className="assignment-list content">
          <table className="assignment-list table">
            <thead className="col-xs-12">
              <tr>
                <th className="sortableHeader" data-sort="name">
                  Student Name
                  <div
                    className="arrowSegment arrowname arrowUnsorted"
                    data-sort="name"
                  />
                </th>
                {renderAssignmentHeaders}
              </tr>
            </thead>
            <tbody className="studentTableBody col-xs-12">
              {students_assignment_data}
            </tbody>
          </table>
        </div>
        <div className="assignment-list footer">
          <button className="new-assignment-button" onClick={toggleModal}>
            <span>Create New Assignment</span>
          </button>
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
    classes: state.teacherData.classes
  };
}
export default connect(
  mapStateToProps,
  {
    teacherLogin,
    getTeacherData,
    toggleModal,
    deleteAssignment
  }
)(TeacherAssignment);
