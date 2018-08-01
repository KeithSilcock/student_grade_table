import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setRecentPage, setActiveStudent } from "../../actions";
import ClassTabs from "../class_tabs";
import { getDailyGreeting } from "../../helper";

import "../../assets/CSS/teacher/header.css";

class Header extends React.Component {
  navToNewAssignment() {
    this.props.history.push("/teacher-portal/new-assignment");
  }

  componentDidMount() {
    if (!this.props.recentPage) {
      this.props.setRecentPage("/teacher-portal/assignment-list");
    }
  }

  navBack() {
    this.props.history.push(this.props.recentPage);
  }

  render() {
    const { teacherData, setRecentPage, setActiveStudent } = this.props;

    if (this.props.match.params[0] === "student-list") {
      var rosterClass = "selected";
      var assignmentsClass = "";
    } else if (this.props.match.params[0] === "assignment-list") {
      var rosterClass = "";
      var assignmentsClass = "selected";
    }
    const exitNewAssignmentButton =
      this.props.match.params[0] === "new-assignment" ? (
        <button onClick={e => this.navBack()} className="header cancel-button">
          Cancel
        </button>
      ) : null;

    return (
      <div className="header header-container">
        <div className="header header-top">
          <h2 className="header title">{`${getDailyGreeting()}${
            teacherData.first_name
          } 
        ${teacherData.last_name}`}</h2>
          <a href="/logout">
            <i class="fas fa-sign-out-alt" /> Close Session
          </a>
        </div>
        <div className="header header-pages">
          <div className="header header-spacer-1" />
          <div className="header header-tabs">
            <Link
              onClick={e => {
                setActiveStudent({});
                setRecentPage("/teacher-portal/assignment-list");
              }}
              className={`${assignmentsClass}`}
              to="/teacher-portal/assignment-list"
            >
              <i className="far fa-edit" />Assignments
            </Link>
            <Link
              className={`${rosterClass}`}
              onClick={e => {
                setActiveStudent({});
                setRecentPage("/teacher-portal/student-list");
              }}
              to="/teacher-portal/student-list"
            >
              <i className="fas fa-users" />Roster
            </Link>
          </div>
          <div className="header header-spacer-2" />
        </div>
        <div className="header header-bottom">
          <ClassTabs userType={`teacher`} />
          <div className="header header-spacer-3"> </div>
          <div className="header buttons">{exitNewAssignmentButton}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentClass: state.teacherData.current_class,
    teacherData: state.teacherData.teacherData,
    recentPage: state.navData.recentPage
  };
}
export default connect(
  mapStateToProps,
  { setRecentPage, setActiveStudent }
)(Header);
