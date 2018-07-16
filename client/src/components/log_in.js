import React from "react";
import LogInForm from "./log_in_form";
import { connect } from "react-redux";

import "../assets/CSS/log_in.css";

class LogIn extends React.Component {
  componentDidUpdate(prevProps, prevState) {
    if (this.props.logged_in) {
      if (this.props.permissions.length > 1) {
        //they are a teacher, redirect to teacher page
        this.props.history.push("/teacher-portal/assignment-list");
      } else {
        //they are a student, redirect to student page
        this.props.history.push("/student-portal/classes");
      }
    }
  }

  render() {
    return (
      <div className="login container">
        <div className="login header">
          <div className="login logo">
            <i className="fas fa-school" />
          </div>
          <h1>Education Web Portal</h1>
          <div className="login spacer" />
        </div>
        <div className="login-boxes">
          <div className="teacher-login container">
            <div className="teacher-login header">
              <h3>
                <i className="fas fa-chalkboard-teacher" /> Educator
              </h3>
            </div>
            <div className="teacher-login body">
              <LogInForm userType={"Administrator"} />
            </div>
          </div>

          <div className="student-login container">
            <div className="student-login header">
              <h3>
                <i className="fas fa-user-graduate" /> Student
              </h3>
            </div>
            <div className="student-login body">
              <LogInForm userType={"Student"} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    logged_in: state.teacherData.logged_in,
    permissions: state.teacherData.permissions
  };
}

export default connect(
  mapStateToProps,
  {}
)(LogIn);
