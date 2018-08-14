import React from "react";
import { connect } from "react-redux";
import {} from "../../actions";
import { getLetterGrade } from "../../helper";

class ClassInfo extends React.Component {
  render() {
    const {
      classes,
      assignments,
      studentData,
      currentClass,
      teacherData
    } = this.props;

    let teachername = "";
    for (
      let teacherIndex = 0;
      teacherIndex < teacherData.length;
      teacherIndex++
    ) {
      const teacher = teacherData[teacherIndex];
      if (teacher.class_id === currentClass.class_id) {
        teachername = `${teacher.first_name} ${teacher.last_name}`;
      }
    }
    let courseDesc = "";
    for (let course in classes) {
      const courseInfo = classes[course];
      if (courseInfo.class_id === currentClass.class_id) {
        courseDesc = `${courseInfo.class_description}`;
      }
    }
    let count = 0;
    const average =
      Object.keys(assignments).reduce((acc, student_id) => {
        const info = assignments[student_id];
        if (info.class_id === currentClass.class_id) {
          if (info.points_total > 0) {
            count++;
            return acc + info.score / info.points_total;
          } else {
            return acc;
          }
        } else {
          return acc;
        }
      }, 0) / count;

    return (
      <div className="class-info container">
        <div className="class-info header">
          <h1>{currentClass.class_name}</h1>
        </div>
        <div className="class-info content">
          <div className="class-info course-average">
            <p className="bold">Grade: </p>
            <p>{`${(average * 100).toFixed(2)}% ${getLetterGrade(average)}`}</p>
          </div>
          <div className="class-info teacher">
            <p className="bold">Teacher: </p>
            <p>{`${teachername}`}</p>
          </div>
          <div className="class-info course-description">
            <p className="bold">Class Description:</p>
            <p>{`${courseDesc}`}</p>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    assignments: state.studentData.assignments,
    classes: state.studentData.classes,
    studentData: state.studentData.student_data,
    teacherData: state.studentData.teacherData,
    currentClass: state.teacherData.current_class,
    tabColor: state.navData.tabColor
  };
}
export default connect(
  mapStateToProps,
  {}
)(ClassInfo);
