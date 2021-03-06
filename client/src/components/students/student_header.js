import React from "react";
import { connect } from "react-redux";
import {} from "../../actions";
import ClassTabs from "../class_tabs";
import { getDailyGreeting } from "../../helper";

import "../../assets/CSS/student/header.css";

class Header extends React.Component {
  render() {
    const { studentData } = this.props;

    return (
      <div className="header student header-container">
        <div className="header student header-top">
          <h2 className="header student title">{`${getDailyGreeting()}${
            studentData.name
          }`}</h2>
          <a href="/logout">
            <i class="fas fa-sign-out-alt" /> Log Out?
          </a>
        </div>
        <div className="header student header-bottom">
          <ClassTabs userType={`student`} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    studentData: state.studentData.student_data
  };
}
export default connect(
  mapStateToProps,
  {}
)(Header);
