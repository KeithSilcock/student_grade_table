import React from "react";
import { connect } from "react-redux";
import { changeActiveClass, setActiveStudent } from "../actions";

import "../assets/CSS/class_tabs.css";

class ClassTabs extends React.Component {
  componentDidMount() {
    const { classes, changeActiveClass, currentClass } = this.props;
    if (Object.keys(classes).length && !currentClass.class_id) {
      const firstClass = Object.keys(classes)[0];

      changeActiveClass(firstClass, classes[firstClass].class_id);
    }
  }

  render() {
    const {
      classes,
      changeActiveClass: changeClass,
      currentClass,
      setActiveStudent
    } = this.props;

    //if no current class, set current class
    if (Object.keys(classes).length && !currentClass.class_id) {
      const firstClass = Object.keys(classes)[0];

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
    currentClass: state.teacherData.current_class,
    classes: state.teacherData.classes
  };
}

export default connect(
  mapStateToProps,
  { changeActiveClass, setActiveStudent }
)(ClassTabs);
