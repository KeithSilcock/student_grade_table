import React from "react";
import "../assets/animations/drop_down_menu.css";

class dropDownMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dropDownIsOpen: false,
      dropDownContents: this.props.dropDownContents,
      dropDownClass: ""
    };

    this.dropDownStyle = {
      position: "absolute"
    };
  }

  toggleDropDown() {
    const { dropDownIsOpen } = this.state;

    const transitionClass = dropDownIsOpen
      ? "closing-drop-down"
      : "opening-drop-down";

    if (dropDownIsOpen) {
      this.setState({
        dropDownClass: transitionClass
      });
      const timeOut = setTimeout(() => {
        this.setState({
          dropDownIsOpen: !dropDownIsOpen,
          dropDownClass: ""
        });
      }, 300);
    } else {
      this.setState({
        dropDownIsOpen: !dropDownIsOpen,
        dropDownClass: transitionClass
      });

      const timeOut = setTimeout(() => {
        this.setState({
          dropDownClass: ""
        });
      }, 300);
    }
  }

  render() {
    const { dropDownIsOpen, dropDownContents, dropDownClass } = this.state;

    const dropDownList = dropDownContents.map((item, index) => {
      return (
        <li
          key={index}
          //   style={this.dropDownStyle}
          className="drop-down-content"
        >
          {item}
        </li>
      );
    });
    const arrow = dropDownIsOpen ? <span>&#9666;</span> : <span>&#9662;</span>;

    return (
      <div>
        <h1>Drop down here</h1>
        <button onClick={this.toggleDropDown.bind(this)}>
          Classes: {arrow}
        </button>
        <ul className={"drop-down-container " + dropDownClass}>
          {dropDownIsOpen ? dropDownList : null}
        </ul>
      </div>
    );
  }
}

export default dropDownMenu;
