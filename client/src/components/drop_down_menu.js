import React from "react";
import "../assets/animations/drop_down_menu.css";

class dropDownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropDownIsOpen: false,
      dropDownClass: ""
    };

    this.dropDownStyle = {
      position: "absolute"
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
    const { dropDownIsOpen, dropDownClass } = this.state;
    const { dropDownContents, changeClass, currentClass } = this.props;

    const dropDownList = Object.keys(dropDownContents).map((item, index, array) => {
      return (
        <li
          key={index}
          onClick={e => {
            changeClass(item, dropDownContents[item].class_id);
            this.toggleDropDown();
          }}
          className="drop-down-content"
        >
          {item}
        </li>
      );
    });
    const arrow = dropDownIsOpen ? <span>&#9666;</span> : <span>&#9662;</span>;

    const displayText = Object.keys(currentClass).length ? `${currentClass.class_name}` : "Classes: ";
    return (
      <div>
        <h1>Drop down here</h1>
        <button onClick={this.toggleDropDown.bind(this)}>
          {displayText} {arrow}
        </button>
        <ul className={"drop-down-container " + dropDownClass}>
          {dropDownIsOpen ? dropDownList : null}
        </ul>
      </div>
    );
  }
}

export default dropDownMenu;
