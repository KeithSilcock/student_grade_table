import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {} from "../../actions";
import ClassTabs from "../class_tabs";

import "../../assets/CSS/header.css";

class Header extends React.Component {
  render() {
    const { studentData } = this.props;

    return (
      <div className="header header-container">
        <div className="header header-top">
          <h2 className="header title">{`Welcome, ${studentData.first_name} 
        ${studentData.last_name}`}</h2>
          <a href="/logout">Log Out?</a>
        </div>
        <div className="header header-bottom">
          <ClassTabs userType={`student`} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.studentData.current_class,
    studentData: state.studentData.teacherData
  };
}
export default connect(
  mapStateToProps,
  {}
)(Header);
