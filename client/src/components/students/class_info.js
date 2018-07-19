import React from "react";
import { connect } from "react-redux";
import {} from "../../actions";

class ClassInfo extends React.Component {
  render() {
    const { classes, studentData, currentClass, teacherData } = this.props;
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

    return (
      <div className="class-info container">
        <div className="class-info header">
          <h1>{currentClass.class_name}</h1>
        </div>
        <div className="class-info content">
          <div className="class-info teacher">
            <p>Teacher: </p>
            <p>{`${teachername}`}</p>
          </div>
          <div className="class-info course-description">
            <p>Class Desc:</p> <p>{`${courseDesc}`}</p>
          </div>
          <div className="class-info course-average">
            <p>Grade: </p>
            <p>{`<AVERAGE>`}</p>
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
    currentClass: state.teacherData.current_class
  };
}
export default connect(
  mapStateToProps,
  {}
)(ClassInfo);
