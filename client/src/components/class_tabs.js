import React from "react";
import { connect } from "react-redux";
import { changeActiveClass, setActiveStudent, setTabColor } from "../actions";
import { getTabColor } from "../helper";

import "../assets/CSS/class_tabs.css";

class ClassTabs extends React.Component {
  render() {
    if (this.props.userType === "student") {
      var {
        classes_S: classes,
        changeActiveClass: changeClass,
        currentClass_S: currentClass,
        setActiveStudent,
        setTabColor
      } = this.props;
    } else {
      var {
        classes_T: classes,
        changeActiveClass: changeClass,
        currentClass_T: currentClass,
        setActiveStudent,
        setTabColor
      } = this.props;
    }

    //if no current class, set current class
    if (Object.keys(classes).length && !currentClass.class_id) {
      const firstClass = Object.keys(classes)[0];
      changeClass(firstClass, classes[firstClass].class_id);
      setTabColor(0);
    }

    const classTabs = Object.keys(classes).map((item, index, array) => {
      const selectedTabClass =
        currentClass.class_id === classes[item].class_id ? "selected-tab" : "";
      return (
        <li
          key={index}
          onClick={e => {
            setActiveStudent({});
            setTabColor(index);
            changeClass(item, classes[item].class_id);
          }}
          className={`class-tabs item ${selectedTabClass}`}
          style={{
            minWidth: `${(100 / Object.keys(classes).length).toFixed(3)}%`,
            backgroundColor: getTabColor(index)
          }}
        >
          {`${item}`}
        </li>
      );
    });

    // const displayText = Object.keys(currentClass).length ? `${currentClass.class_name}` : "Classes: ";
    return (
      <div className="class-tabs container">
        <ul className={"class-tabs list"}>{classTabs}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass_T: state.teacherData.current_class,
    classes_T: state.teacherData.classes,
    currentClass_S: state.teacherData.current_class,
    classes_S: state.studentData.classes
  };
}

export default connect(
  mapStateToProps,
  { changeActiveClass, setActiveStudent, setTabColor }
)(ClassTabs);
