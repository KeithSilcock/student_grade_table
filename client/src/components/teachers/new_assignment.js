import React from "react";
import DropDownMenu from "../drop_down_menu";
import { connect } from "react-redux";
import { addNewAssignment, getTeacherData } from "../../actions";

import "../../assets/CSS/new_assignments.css";

class NewAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignmentName: "Best Assignment",
      assignmentData: {
        abc123: {
          comments: "best",
          points_total: "40",
          score: "39"
        },
        asd143: {
          comments: "sorry sam ",
          points_total: "40",
          score: "15"
        },
        def456: {
          comments: "second",
          points_total: "40",
          score: "37"
        }
      }
    };

    this.changeInput = this.changeStudentInput.bind(this);
  }

  changeAssignmentInput(e) {
    const { value } = e.target;

    this.setState({
      ...this.state,
      assignmentName: value
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

  render() {
    const { assignmentName } = this.state;
    const {
      studentData: { student_list },
      currentClass,
      addNewAssignment,
      toggleModal,
      getTeacherData
    } = this.props;

    const studentData = student_list.map((student, index) => {
      if (currentClass.class_id === student.class_id) {
        const { comments, points_total, score } = this.state.assignmentData[student.school_id];

        return (
          <tr
            key={index}
            // className="teacher-student-table-row"
          >
            <td>
              {student.first_name} {student.last_name}
            </td>
            <td>
              {
                <input
                  className="new-assignment input score"
                  onChange={e => this.changeStudentInput(e, student.school_id)}
                  type="text"
                  name={`score`}
                  value={score}
                />
              }/{
                <input
                  className="new-assignment input points_total"
                  onChange={e => this.changeStudentInput(e, student.school_id)}
                  type="text"
                  name={`points_total`}
                  value={points_total}
                />
              }
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

    return (
      <div className="new-assignment container">
        <div className="new-assignment top">
          <div className="new-assignment header">
            <DropDownMenu />
            <div className="spacer" />
            <h4>New Assignment</h4>
          </div>
          <div className="new-assignment title">
            <span className="new-assignment text">Assignment Title: </span>
            <input
              onChange={this.changeAssignmentInput.bind(this)}
              type="text"
              name="assignmentTitle"
              placeholder="Assignment Name"
              value={assignmentName}
            />
          </div>
          <div className="new-assignment student-info">
            <table className="new-assignment container table">
              <thead className="col-xs-12">
                <tr>
                  <th className="sortableHeader" data-sort="name">
                    Student Name
                    <div className="arrowSegment arrowname arrowUnsorted" data-sort="name" />
                  </th>
                  <th>Student Score</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody className="studentTableBody col-xs-12">{studentData}</tbody>
            </table>
          </div>
        </div>
        <div className="new-assignment bottom">
          <button
            onClick={e => {
              toggleModal();
              addNewAssignment(this.state, currentClass.class_id);
              getTeacherData();
            }}
            className="new-assignment-button"
          >
            Add Assignment
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.teacherData.current_class,
    studentData: state.teacherData.student_data
  };
}

export default connect(
  mapStateToProps,
  { addNewAssignment, getTeacherData }
)(NewAssignment);
