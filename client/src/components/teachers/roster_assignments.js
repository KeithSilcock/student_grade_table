import React from "react";
import { connect } from "react-redux";
import {} from "../../actions";
import {
  getAverageFromAssignments,
  formatGrade,
  getClassAverage,
  getLetterGrade
} from "../../helper";
import DoubleClickToEdit from "./double_click_editable";
import AddNewStudent from "./add_new_student";

//Uses css from teacher_page.css

class AssignmentsTab extends React.Component {
  navToNewAssignment() {
    this.props.history.push("/teacher-portal/new-assignment");
  }

  render() {
    const {
      activeStudent,
      currentClass,
      studentData: { assignment_list },
      tabColor
    } = this.props;

    if (assignment_list && Object.keys(currentClass).length) {
      var averageGradePerAssignment = getAverageFromAssignments(
        assignment_list,
        currentClass
      );
      var averageClassGrade = getClassAverage(assignment_list, currentClass);
    }
    if (averageGradePerAssignment) {
      var renderAvgPerAssignment = Object.keys(averageGradePerAssignment).map(
        (assignment_id, index) => {
          const assignmentAverage = averageGradePerAssignment[assignment_id];
          return (
            <tr className={`roster-assignment table-row`} key={index}>
              <td className={`roster-assignment average assignment-name`}>
                <DoubleClickToEdit
                  classToGive="roster-assignment double-click-name"
                  valueName="assignment_name"
                  objectData={assignmentAverage}
                  inputSize={12}
                />
              </td>
              <td className={`roster-assignment average score`}>
                <span className="roster-assignment avg">{`${formatGrade(
                  assignmentAverage.avg / assignmentAverage.count,
                  2
                )}`}</span>
                <span className="roster-assignment letter-grade">{`${getLetterGrade(
                  assignmentAverage.avg / assignmentAverage.count
                )}`}</span>
              </td>
            </tr>
          );
        }
      );
    }

    if (assignment_list && Object.keys(activeStudent).length) {
      var assignments = assignment_list.map((item, index) => {
        if (
          item.class_id === currentClass.class_id &&
          item.student_id === activeStudent.school_id
        ) {
          const redZeroClass = item.points_total ? "" : "red-zero";
          return (
            <tr className={`roster-assignment table-row`} key={index}>
              <td className="roster-assignment assignment-name">
                <DoubleClickToEdit
                  classToGive="roster-assignment double-click-name"
                  valueName="assignment_name"
                  objectData={item}
                  inputSize={12}
                />
              </td>
              <td className="roster-assignment points">
                <div className="roster-assignment score-box">
                  <DoubleClickToEdit
                    inputSize={4}
                    classToGive="score"
                    valueName="score"
                    objectData={item}
                  />
                  <span className="roster-assignment spacer">/</span>
                  <DoubleClickToEdit
                    inputSize={4}
                    classToGive={`points_total ${redZeroClass}`}
                    valueName={`points_total`}
                    objectData={item}
                  />
                  <span className="roster-assignment avg">{`${formatGrade(
                    item.score / item.points_total
                  )}`}</span>
                </div>
              </td>
            </tr>
          );
        }
      });
    } else if (assignment_list) {
      var assignments = renderAvgPerAssignment;
    }

    const headerName = activeStudent.firstName
      ? `${activeStudent.firstName} ${activeStudent.lastName}: `
      : `Class Avg: ${formatGrade(averageClassGrade, 2)}`;
    const headerStyle = { backgroundColor: tabColor };

    return (
      <div className="roster-assignment container">
        <div className="roster-assignment top">
          <div style={headerStyle} className="roster-assignment header">
            <h2>{headerName}</h2>
          </div>
          <div className="roster-assignment content">
            <table className="roster-assignment table">
              <thead className="roster-assignment table-head">
                <tr>
                  <th className="sortableHeader" data-sort="name">
                    Assignment Name
                    <div
                      className="arrowSegment arrowname arrowUnsorted"
                      data-sort="name"
                    />
                  </th>
                  <th className="sortableHeader" data-sort="grade">
                    Score
                    <div
                      className="arrowSegment arrowgrade arrowUnsorted"
                      data-sort="grade"
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="roster-assignment table-body">
                {assignments}
              </tbody>
            </table>
          </div>
        </div>
        <div className="roster-assignment footer">
          <button
            className="assignment-list standard-green-button"
            onClick={e => this.navToNewAssignment(e)}
          >
            <span>Create New Assignment</span>
          </button>
          <AddNewStudent />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    studentData: state.teacherData.student_data,
    currentClass: state.teacherData.current_class,
    activeStudent: state.teacherData.activeStudent,
    tabColor: state.navData.tabColor
  };
}

export default connect(
  mapStateToProps,
  {}
)(AssignmentsTab);
