import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions";
import DoubleClickToEdit from "./double_click_editable";

//Uses css from teacher_page.css

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
            <tr className={`roster-assignment table-row`} key={index}>
              <td className="roster-assignment assignment-name">
                <DoubleClickToEdit
                  classToGive="roster-assignment double-click-name"
                  valueName="assignment_name"
                  objectData={item}
                  inputSize={15}
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
                </div>
              </td>
            </tr>
          );
        }
      });
    }

    const headerName = activeStudent.firstName
      ? `${activeStudent.firstName} ${activeStudent.lastName}: `
      : "Assignments";

    return (
      <div className="roster-assignment container">
        <div className="roster-assignment top">
          <div className="roster-assignment header">
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
          <button className="standard-button" onClick={toggleModal}>
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
