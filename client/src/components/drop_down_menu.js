import React from "react";
import { connect } from "react-redux";
import { changeActiveClass, setActiveStudent } from "../actions";
import "../assets/CSS/animations/drop_down_menu.css";
import "../assets/CSS/drop_down.css";

class DropDownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropDownIsOpen: false,
      dropDownClass: "",
      isFirstTime: true
    };
  }

  toggleDropDown() {
    const { dropDownIsOpen } = this.state;

    const transitionClass = dropDownIsOpen ? "closing-drop-down" : "opening-drop-down";

    if (dropDownIsOpen) {
      this.setState({
        dropDownClass: transitionClass
      });
      const timeOut = setTimeout(() => {
        this.setState({
          dropDownIsOpen: !dropDownIsOpen,
          dropDownClass: ""
        });

        clearTimeout(timeOut);
      }, 200);
    } else {
      this.setState({
        dropDownIsOpen: !dropDownIsOpen,
        dropDownClass: transitionClass
      });

      const timeOut = setTimeout(() => {
        this.setState({
          dropDownClass: ""
        });
        clearTimeout(timeOut);
      }, 200);
    }
  }

  render() {
    const { dropDownIsOpen, dropDownClass, isFirstTime } = this.state;
    const {
      classes: dropDownContents,
      changeActiveClass: changeClass,
      currentClass,
      setActiveStudent
    } = this.props;

    const dropDownList = Object.keys(dropDownContents).map((item, index, array) => {
      if (isFirstTime) {
        this.setState({
          ...this.state,
          isFirstTime: false
        });
        changeClass(item, dropDownContents[item].class_id);
      }

      return (
        <li
          key={index}
          onClick={e => {
            setActiveStudent({});
            changeClass(item, dropDownContents[item].class_id);
            this.toggleDropDown();
          }}
          className="drop-down content"
        >
          {`${item}`}
        </li>
      );
    });
    const arrow = dropDownIsOpen ? <span>&#9666;</span> : <span>&#9662;</span>;

    const displayText = Object.keys(currentClass).length ? `${currentClass.class_name}` : "Classes: ";
    return (
      <div className="drop-down-container">
        <button onClick={this.toggleDropDown.bind(this)}>
          {`Class: ${displayText}`} {arrow}
        </button>
        <ul className={"drop-down list " + dropDownClass}>{dropDownIsOpen ? dropDownList : null}</ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.assignmentList.current_class,
    classes: state.availableClasses.classes
  };
}

export default connect(
  mapStateToProps,
  { changeActiveClass, setActiveStudent }
)(DropDownMenu);
