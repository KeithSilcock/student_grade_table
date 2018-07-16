import React from "react";
import { connect } from "react-redux";
import { changeActiveClass, setActiveStudent } from "../actions";

import "../assets/CSS/class_tabs.css";

class ClassTabs extends React.Component {
  render() {
    if (this.props.userType === "student") {
      var {
        classes_S: classes,
        changeActiveClass: changeClass,
        currentClass_S: currentClass,
        setActiveStudent
      } = this.props;
    } else {
      var {
        classes_T: classes,
        changeActiveClass: changeClass,
        currentClass_T: currentClass,
        setActiveStudent
      } = this.props;
    }

    //if no current class, set current class
    if (Object.keys(classes).length && !currentClass.class_id) {
      const firstClass = Object.keys(classes)[0];
      debugger;
      changeClass(firstClass, classes[firstClass].class_id);
    }

    const classTabs = Object.keys(classes).map((item, index, array) => {
      const selectedTabClass =
        currentClass.class_id === classes[item].class_id ? "selected-tab" : "";
      return (
        <li
          key={index}
          onClick={e => {
            setActiveStudent({});
            changeClass(item, classes[item].class_id);
          }}
          className={`class-tabs item ${selectedTabClass}`}
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
    classes_S: state.teacherData.classes
  };
}

export default connect(
  mapStateToProps,
  { changeActiveClass, setActiveStudent }
)(ClassTabs);
