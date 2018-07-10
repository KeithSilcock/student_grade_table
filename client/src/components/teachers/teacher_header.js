import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toggleModal } from "../../actions";
import AddNewStudent from "./add_new_student";
import ClassTabs from "../class_tabs";

import "../../assets/CSS/header.css";

class Header extends React.Component {
  render() {
    const { teacherData, toggleModal } = this.props;

    if (this.props.match.params.location === "student-list") {
      var rosterClass = "selected";
      var assignmentsClass = "";
    } else if (this.props.match.params.location === "assignment-list") {
      var rosterClass = "";
      var assignmentsClass = "selected";
    }

    return (
      <div className="header header-container">
        <div className="header header-top">
          <h2 className="header title">{`Welcome, ${teacherData.first_name} 
        ${teacherData.last_name}`}</h2>
          <AddNewStudent />
        </div>
        <div className="header header-pages">
          <Link className={`${rosterClass}`} to="/teacher-portal/student-list">
            <i class="fas fa-users" />Roster
          </Link>
          <Link
            className={`${assignmentsClass}`}
            to="/teacher-portal/assignment-list"
          >
            <i class="far fa-edit" />Assignments
          </Link>
        </div>
        <div className="header header-bottom">
          <ClassTabs />
          <button className=" assignment-list tab-button" onClick={toggleModal}>
            <span>Create New Assignment</span>
          </button>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teacherData: state.teacherData.teacherData
  };
}
export default connect(
  mapStateToProps,
  { toggleModal }
)(Header);
