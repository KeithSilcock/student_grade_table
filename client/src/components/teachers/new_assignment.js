import React from "react";
import { connect } from "react-redux";
import { addNewAssignment, getTeacherData } from "../../actions";
import {
  homeworkRandomizer,
  commentRandomizer
} from "../../dummy_data/assignment_data";
import { findRandNumberBetween } from "../../helper/";

import "../../assets/CSS/teacher/new_assignments.css";
import { header } from "express-validator/check";

class NewAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignmentName: "",
      assignmentData: {},
      out_of: "",
      canEditPointsTotal: {}
    };

    this.changeInput = this.changeStudentInput.bind(this);
    this.changeAssignmentInput = this.changePointsTotalInput.bind(this);
  }

  componentDidMount() {
    const {
      studentData: { student_list }
    } = this.props;
    const outOf = findRandNumberBetween(25, 100);

    document.title = "New Assignment";

    if (student_list) {
      const assignmentData = {};
      for (
        let studentIndex = 0;
        studentIndex < student_list.length;
        studentIndex++
      ) {
        const student = student_list[studentIndex];
        this.props.currentClass;
        if (student.class_id === this.props.currentClass.class_id) {
          assignmentData[student.school_id] = {
            comments: commentRandomizer(
              `${student.first_name} ${student.last_name}`
            ),
            points_total: outOf,
            score: findRandNumberBetween(0, outOf)
          };
        }
      }

      this.setState({
        ...this.state,
        assignmentData,
        out_of: outOf,
        assignmentName: homeworkRandomizer(this.props.currentClass.class_name)
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentClass: newClass,
      studentData: { student_list }
    } = nextProps;
    const { currentClass: oldClass } = this.props;

    if (newClass.class_id !== oldClass.class_id) {
      const outOf = findRandNumberBetween(25, 100);

      document.title = "New Assignment";

      if (student_list) {
        const assignmentData = {};
        for (
          let studentIndex = 0;
          studentIndex < student_list.length;
          studentIndex++
        ) {
          const student = student_list[studentIndex];
          nextProps.currentClass;
          if (student.class_id === nextProps.currentClass.class_id) {
            assignmentData[student.school_id] = {
              comments: commentRandomizer(
                `${student.first_name} ${student.last_name}`
              ),
              points_total: outOf,
              score: findRandNumberBetween(0, outOf)
            };
          }
        }

        this.setState({
          ...this.state,
          assignmentData,
          out_of: outOf,
          assignmentName: homeworkRandomizer(nextProps.currentClass.class_name)
        });
      }
    }
  }

  changeInputSimple(e) {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      [name]: value
    });
  }

  changePointsTotalInput(e) {
    const { assignmentData, canEditPointsTotal } = this.state;
    const { name, value } = e.target;

    var newAssignmentData = {};

    for (let student_id in assignmentData) {
      if (!canEditPointsTotal[student_id]) {
        newAssignmentData = {
          ...newAssignmentData,
          [student_id]: {
            ...assignmentData[student_id],
            [name]: value
          }
        };
      }
    }

    newAssignmentData = Object.assign({ ...assignmentData }, newAssignmentData);

    this.setState({
      ...this.state,
      assignmentData: newAssignmentData,
      out_of: value
    });
  }

  changeStudentInput(e, student_id) {
    const { assignmentData } = this.state;
    const { name, value } = e.target;

    var newAssignmentData = {
      ...assignmentData,
      [student_id]: {
        ...assignmentData[student_id],
        [name]: value
      }
    };

    this.setState({
      ...this.state,
      assignmentData: newAssignmentData
    });
  }

  handleDifferentPointsTotal(e, school_id) {
    const { canEditPointsTotal } = this.state;
    this.setState({
      ...this.state,
      canEditPointsTotal: { ...canEditPointsTotal, [school_id]: true }
    });
    // }
  }

  render() {
    const {
      assignmentName,
      out_of,
      canEditPointsTotal,
      assignmentData
    } = this.state;
    const {
      studentData: { student_list },
      currentClass,
      addNewAssignment,
      getTeacherData,
      tabColor
    } = this.props;

    if (student_list && Object.keys(assignmentData).length) {
      var studentData = student_list.map((student, index) => {
        if (currentClass.class_id === student.class_id) {
          const { comments, points_total, score } = assignmentData[
            student.school_id
          ];

          if (canEditPointsTotal[student.school_id]) {
            var points = points_total;
          } else {
            var points = out_of;
          }

          return (
            <tr key={index}>
              <td>
                {student.first_name} {student.last_name}
              </td>
              <td>
                <div className="new-assignment points-inputs">
                  {
                    <input
                      className="new-assignment input score"
                      onChange={e =>
                        this.changeStudentInput(e, student.school_id)
                      }
                      onFocus={e => e.target.select()}
                      type="text"
                      name={`score`}
                      value={score}
                    />
                  }
                  <span className="divisor">/</span>
                  {
                    <input
                      onKeyDown={e =>
                        this.handleDifferentPointsTotal(e, student.school_id)
                      }
                      className="new-assignment input points_total"
                      onChange={e =>
                        this.changeStudentInput(e, student.school_id)
                      }
                      onFocus={e => e.target.select()}
                      type="text"
                      name={`points_total`}
                      value={points}
                    />
                  }
                </div>
              </td>
              <td>
                <textarea
                  name="comments"
                  cols="30"
                  rows="2"
                  onChange={e => this.changeStudentInput(e, student.school_id)}
                  value={comments}
                />
              </td>
            </tr>
          );
        }
      });
    }

    const headerStyle = { backgroundColor: tabColor };

    return (
      <div className="new-assignment container">
        <div className="new-assignment top">
          <div style={headerStyle} className="new-assignment header">
            <h3>Create A New Assignment</h3>
          </div>
          <div className="new-assignment title">
            <div className="new-assignment input-box">
              <span className="new-assignment text">Assignment: </span>
              <input
                onChange={e => this.changeInputSimple(e)}
                onFocus={e => e.target.select()}
                type="text"
                name="assignmentName"
                placeholder="Assignment Name"
                value={assignmentName}
              />
            </div>
            <div className="new-assignment input-box total-score">
              <span className="new-assignment total-score text">Out Of:</span>
              <input
                onChange={e => this.changePointsTotalInput(e)}
                onFocus={e => e.target.select()}
                type="text"
                name="points_total"
                placeholder="100"
                value={out_of}
              />
            </div>
            <div className="new-assignment add-assignment">
              <button
                onClick={e => {
                  const {
                    assignmentName,
                    assignmentData,
                    out_of,
                    canEditPointsTotal
                  } = this.state;
                  addNewAssignment(this.state, currentClass.class_id);
                  this.props.history.push(this.props.recentPage);
                }}
                className="standard-green-button"
              >
                Create Assignment
              </button>
            </div>
          </div>
          <div className="new-assignment student-info">
            <table className="new-assignment container table">
              <thead className="col-xs-12">
                <tr>
                  <th className="sortableHeader" data-sort="name">
                    Student Name
                    <div
                      className="arrowSegment arrowname arrowUnsorted"
                      data-sort="name"
                    />
                  </th>
                  <th>Student Score</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody className="studentTableBody col-xs-12">
                {studentData}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.teacherData.current_class,
    studentData: state.teacherData.student_data,
    recentPage: state.navData.recentPage,
    tabColor: state.navData.tabColor
  };
}

export default connect(
  mapStateToProps,
  { addNewAssignment, getTeacherData }
)(NewAssignment);
