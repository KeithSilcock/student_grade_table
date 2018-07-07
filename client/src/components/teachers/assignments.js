import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions";
import DoubleClickToEdit from "./double_click_editable";

class AssignmentsTab extends React.Component {
  render() {
    const {
      activeStudent,
      currentClass,
      studentData: { assignment_list },
      toggleModal
    } = this.props;

    if (assignment_list && activeStudent) {
      var assignments = assignment_list.map((item, index) => {
        if (
          item.class_id === currentClass.class_id &&
          item.student_id === activeStudent.school_id
        ) {
          const redZeroClass = item.points_total ? "" : "red-zero";
          return (
            <tr className={`assignments-tab table-row`} key={index}>
              <td>{item.assignment_name}</td>
              <td>
                <div className="assignment-list assignment">
                  <DoubleClickToEdit valueName="score" objectData={item} />
                  <span className="assignment-list spacer">/</span>
                  <DoubleClickToEdit
                    valueName="points_total"
                    objectData={item}
                    className={redZeroClass}
                  />
                </div>
              </td>
            </tr>
          );
        }
      });
    }

    const headerName = activeStudent.firstName
      ? `Assignments for: ${activeStudent.firstName} ${activeStudent.lastName}`
      : "Assignments";

    return (
      <div className="assignment-tab-container">
        <div className="assignment-box-top">
          <div className="assignment-tab-header">
            <h5>{headerName}</h5>
          </div>
          <div className="assignment-tab-content">
            <table className="student-list-container student-list table">
              <thead className="col-xs-12 assignment-sidebar-header">
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
              <tbody>{assignments}</tbody>
            </table>
          </div>
        </div>
        <div className="assignment-footer">
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
    studentData: state.teacherData.student_data,
    currentClass: state.teacherData.current_class,
    activeStudent: state.teacherData.activeStudent
  };
}

export default connect(
  mapStateToProps,
  { toggleModal }
)(AssignmentsTab);
