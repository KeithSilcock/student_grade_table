import React, { Fragment } from "react";
import { connect } from "react-redux";
import { getTeacherData, deleteAssignment } from "../../actions";
import AddNewStudent from "./add_new_student";
import DoubleClickToEdit from "./double_click_editable";
import WarningModal from "./warning_modal";
import { formatGrade, getAverageFromAssignments } from "../../helper";

import "../../assets/CSS/teacher/assignment-list.css";
import "../../assets/CSS/animations/delete_anim.css";

class TeacherAssignment extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableAssignments: {},
      editingOpen: false,
      openInput_id: "",
      pressedDelete: { bool: false, id: "" },
      deleteModalOpen: false,
      deleteAssignmentObj: { name: "", id: "" }
    };
  }

  async componentWillMount() {
    try {
      // await this.props.teacherLogin();
      await this.props.getTeacherData();
    } catch (err) {
      throw err;
    }
  }
  componentDidMount() {
    document.title = "Assignments";
  }

  toggleDeleteModal(delete_id, assigmentName) {
    const { deleteModalOpen } = this.state;

    if (assigmentName) {
      this.setState({
        ...this.state,
        deleteModalOpen: !deleteModalOpen,
        deleteAssignmentObj: { name: assigmentName, id: delete_id }
      });
    } else {
      this.setState({
        ...this.state,
        deleteModalOpen: !deleteModalOpen,
        deleteAssignmentObj: { name: "", id: "" }
      });
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

  deleteAnimation(assignmentData) {
    this.setState(
      {
        ...this.state,
        pressedDelete: { bool: true, id: assignmentData },
        deleteModalOpen: false,
        deleteAssignmentObj: { name: "", id: "" }
      },
      () => {
        this.props.getTeacherData();
      }
    );
    var thisTimeout = setTimeout(() => {
      this.setState(
        {
          ...this.state,
          pressedDelete: { bool: false, id: "" }
        },
        () => {
          clearTimeout(thisTimeout);
        }
      );
    }, 700);
  }

  toggleEditMode(student_id) {
    const { editingOpen } = this.state;
    this.setState({
      ...this.state,
      editingOpen: !editingOpen,
      openInput_id: student_id
    });
  }

  navToNewAssignment() {
    this.props.history.push("/teacher-portal/new-assignment");
  }

  render() {
    const {
      availableAssignments,
      editingOpen,
      openInput_id,
      pressedDelete,
      deleteModalOpen,
      deleteAssignmentObj
    } = this.state;
    const {
      currentClass,
      studentData: { student_list, assignment_list },
      assignments,
      deleteAssignment,
      tabColor
    } = this.props;

    //format assignments to get averages
    if (assignment_list && Object.keys(currentClass).length) {
      var averageGradePerAssignment = getAverageFromAssignments(
        assignment_list,
        currentClass
      );
    }

    //get all table headers
    if (currentClass.class_name) {
      var renderAssignmentHeaders = Object.keys(availableAssignments).map(
        (assignment_id, index) => {
          const assignment = availableAssignments[assignment_id];

          const deleteAnimationClasses =
            pressedDelete.bool && pressedDelete.id === assignment_id
              ? "assignment-deleting-animation"
              : "";

          return (
            <Fragment key={index}>
              <th
                className={`assignment-list sortableHeader ${deleteAnimationClasses}`}
                data-sort={assignment.assignment_name}
              >
                <div
                  className="assignment-list delete"
                  onClick={e => {
                    this.toggleDeleteModal(
                      assignment_id,
                      assignment.assignment_name
                    );
                  }}
                >
                  <span>&times;</span>
                </div>
                <div className="assignment-list assignment-name">
                  <DoubleClickToEdit
                    valueName="assignment_name"
                    objectData={assignment}
                    toggleEditMode={e => this.toggleEditMode(e)}
                  />
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
          //if they are editing a grade, mark student name
          //in color to indicate editing
          var studentEditOpenClass =
            editingOpen && openInput_id === student.school_id
              ? "editing-student"
              : "";

          if (assignments[student.school_id]) {
            var assignment_row_data = assignments[
              student.school_id
            ].assignments.map((assignment, index2) => {
              if (currentClass.class_id === assignment.class_id) {
                const redZeroClass = assignment.points_total ? "" : "red-zero";

                const deleteAnimationClasses =
                  pressedDelete.bool &&
                  pressedDelete.id == assignment.assignment_id
                    ? "assignment-deleting-animation"
                    : "";

                return (
                  <td
                    key={index2}
                    className={`assignment-list ${deleteAnimationClasses} ${studentEditOpenClass}`}
                  >
                    <div className="assignment-list assignment">
                      <DoubleClickToEdit
                        inputSize={4}
                        valueName="score"
                        objectData={assignment}
                        toggleEditMode={e => this.toggleEditMode(e)}
                      />
                      <span className="assignment-list spacer">/</span>
                      <DoubleClickToEdit
                        inputSize={4}
                        valueName="points_total"
                        objectData={assignment}
                        className={redZeroClass}
                        toggleEditMode={e => this.toggleEditMode(e)}
                      />
                    </div>
                  </td>
                );
              }
            });
          } else {
            var assignment_row_data = Object.keys(availableAssignments).map(
              (assignment_id, index, array) => {
                //need to add onclick that will allow for edit
                return (
                  <td key={index}>
                    {0}/{0}
                  </td>
                );
              }
            );
          }
          return (
            <tr key={index1} className={`${studentEditOpenClass}`}>
              <td className={studentEditOpenClass}>
                {student.first_name} {student.last_name}
              </td>
              {assignment_row_data}
            </tr>
          );
        }
      });
    }

    //get averages for all assignments
    if (averageGradePerAssignment) {
      var renderAvgPerAssignment = Object.keys(averageGradePerAssignment).map(
        (assignment_id, index) => {
          const deleteAnimationClasses =
            pressedDelete.bool && pressedDelete.id == assignment_id
              ? "assignment-deleting-animation"
              : "";

          return (
            <td
              className={`assignment-list average ${deleteAnimationClasses}`}
              key={index}
            >
              {formatGrade(
                averageGradePerAssignment[assignment_id].avg /
                  averageGradePerAssignment[assignment_id].count,
                2
              )}
            </td>
          );
        }
      );
    }
    const warningHeader = `${deleteAssignmentObj.name}`;
    const warningConfirm = () => {
      this.deleteAnimation(deleteAssignmentObj.id);
      deleteAssignment(deleteAssignmentObj.id);
    };
    const warningCancel = () => {
      this.toggleDeleteModal();
    };
    const renderDeleteModal = deleteModalOpen ? (
      <WarningModal
        header={warningHeader}
        confirm={warningConfirm}
        cancel={warningCancel}
      />
    ) : null;

    const headerStyle = { backgroundColor: tabColor };

    return (
      <div className="assignment-list container">
        {renderDeleteModal}
        <div className="assignment-list content">
          <div style={headerStyle} className="assignment-list header">
            <h3>Assignments</h3>
          </div>
          <div className="assignment-list scroll-area">
            <table className="assignment-list table">
              <thead className="assignment-list table-header">
                <tr>
                  <th
                    className="assignment-list student-name sortableHeader"
                    data-sort="name"
                  >
                    Student Name
                  </th>
                  {renderAssignmentHeaders}
                </tr>
              </thead>
              <tbody className="assignment-list table-body">
                <tr className="assignment-list average-row">
                  <td className="assignment-list average">Class Average</td>
                  {renderAvgPerAssignment}
                </tr>

                {students_assignment_data}
              </tbody>
            </table>
          </div>
        </div>
        <div className="assignment-list footer">
          <div className="assignment-list new-assigment">
            <button
              className="assignment-list standard-green-button"
              onClick={e => this.navToNewAssignment(e)}
            >
              <span>Create New Assignment</span>
            </button>
            <AddNewStudent />
          </div>
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
    classes: state.teacherData.classes,
    tabColor: state.navData.tabColor
  };
}
export default connect(
  mapStateToProps,
  {
    getTeacherData,
    deleteAssignment
  }
)(TeacherAssignment);
