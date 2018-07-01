import React from "react";
import DropDownMenu from "../drop_down_menu";
import { connect } from "react-redux";
import { addNewAssignment, getTeacherData, toggleModal } from "../../actions";

import "../../assets/CSS/new_assignments.css";

class NewAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      assignmentName: "Best Assignment",
      assignmentData: {},
      out_of: "",
      canEditPointsTotal: {}
    };

    this.changeInput = this.changeStudentInput.bind(this);
    this.changeAssignmentInput = this.changeHeaderInput.bind(this);
  }

  componentWillMount() {
    const {
      studentData: { student_list }
    } = this.props;

    const assignmentData = {};
    for (
      let studentIndex = 0;
      studentIndex < student_list.length;
      studentIndex++
    ) {
      const student = student_list[studentIndex];
      assignmentData[student.school_id] = {
        comments: "",
        points_total: 0,
        score: 0
      };
    }

    this.setState({
      ...this.state,
      assignmentData
    });
  }

  changeHeaderInput(e) {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      [name]: value
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
    if (e.key === "Backspace") {
      debugger;
      this.setState({
        ...this.state,
        canEditPointsTotal: { ...canEditPointsTotal, [school_id]: true }
      });
    }
  }

  render() {
    const { assignmentName, out_of, canEditPointsTotal } = this.state;
    const {
      studentData: { student_list },
      currentClass,
      addNewAssignment,
      toggleModal,
      getTeacherData
    } = this.props;

    const studentData = student_list.map((student, index) => {
      if (currentClass.class_id === student.class_id) {
        const { comments, points_total, score } = this.state.assignmentData[
          student.school_id
        ];

        if (canEditPointsTotal[student.school_id]) {
          var points = points_total;
        } else {
          var points = out_of;
        }

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
                  onKeyDown={e =>
                    this.handleDifferentPointsTotal(e, student.school_id)
                  }
                  className="new-assignment input points_total"
                  onChange={e => this.changeStudentInput(e, student.school_id)}
                  type="text"
                  name={`points_total`}
                  value={points}
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
            <span className="new-assignment text">Assignment: </span>
            <input
              onChange={e => this.changeHeaderInput(e)}
              type="text"
              name="assignmentName"
              placeholder="Assignment Name"
              value={assignmentName}
            />
            <span className="new-assignment total-score text">Out Of:</span>
            <input
              onChange={e => this.changeHeaderInput(e)}
              type="text"
              name="out_of"
              placeholder="100"
              value={out_of}
            />
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
  { addNewAssignment, getTeacherData, toggleModal }
)(NewAssignment);