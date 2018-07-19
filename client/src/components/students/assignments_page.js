import React from "react";
import { connect } from "react-redux";
import {} from "../../actions";

import "../../assets/CSS/student_page.css";

class StudentAssignments extends React.Component {
  render() {
    const { assignments, currentClass } = this.props;

    const assignmentData = Object.keys(assignments).map(
      (assignmentKey, index) => {
        const assignment = assignments[assignmentKey];

        if (assignment.class_id === currentClass.class_id) {
          return (
            <tr key={index}>
              <td className={`student-assignments assignment`}>
                {assignmentKey}
              </td>
              <td className="student-assignments score">
                {`${assignment.score} / ${assignment.points_total}`}
              </td>
              <td className="student-assignments comments">
                <div className="student-assignments comment-box">
                  {assignment.comments}
                </div>
              </td>
              <td className="student-assignments average">
                {`<GRADE GOES HERE>`}
              </td>
            </tr>
          );
        } else {
          return null;
        }
      }
    );

    return (
      <div className="student-assignments container">
        <div className="student-assignments content">
          <table className="student-assignments table">
            <thead className="student-assignments table-header">
              <tr>
                <th
                  className="student-assignments assignment-name sortableHeader"
                  data-sort="name"
                >
                  Assignment
                </th>
                <th className="student-assignments grade" data-sort="name">
                  Score
                </th>
                <th className="student-assignments comments" data-sort="name">
                  Comments
                </th>
                <th
                  className="student-assignments class-average sortableHeader"
                  data-sort="name"
                >
                  Class Average
                </th>
              </tr>
            </thead>
            <tbody className="student-assignments table-body">
              {assignmentData}
            </tbody>
          </table>
        </div>
        <div className="student-assignments footer" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assignments: state.studentData.assignments,
    classes: state.studentData.classes,
    studentData: state.studentData.student_data,
    currentClass: state.teacherData.current_class
  };
}

export default connect(
  mapStateToProps,
  {}
)(StudentAssignments);
