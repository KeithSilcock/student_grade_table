import React from "react";
import LogInForm from "./log_in_form";
import { connect } from "react-redux";
import { removeLoginError } from "../../actions";

import "../../assets/CSS/log_in.css";
import "../../assets/CSS/animations/login_fail.css";

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false
    };
  }

  componentDidMount() {
    document.title = "Login";
  }

  componentDidUpdate(prevProps, prevState) {
    //check if correct login
    if (this.props.logged_in) {
      if (this.props.permissions.length > 1) {
        //they are a teacher, redirect to teacher page
        this.props.history.push("/teacher-portal/assignment-list");
      } else {
        //they are a student, redirect to student page
        this.props.history.push("/student-portal/classes");
      }
    }

    // if not correct login:
    if (this.props.errors.indexOf("No User") >= 0) {
      this.props.removeLoginError();
      this.setState({
        ...this.state,
        hasError: true
      });
    }
    if (this.state.hasError) {
      setTimeout(() => {
        this.setState({
          ...this.state,
          hasError: false
        });
      }, 10000);
    }
  }

  clearError() {
    this.props.removeLoginError();
    this.setState({
      ...this.state,
      hasError: false
    });
  }

  render() {
    const { hasError } = this.state;

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
              <LogInForm
                clearError={this.clearError.bind(this)}
                hasError={hasError}
                userType={"Administrator"}
              />
            </div>
          </div>

          <div className="student-login container">
            <div className="student-login header">
              <h3>
                <i className="fas fa-user-graduate" /> Student
              </h3>
            </div>
            <div className="student-login body">
              <LogInForm
                clearError={this.clearError.bind(this)}
                hasError={hasError}
                userType={"Student"}
              />
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
    permissions: state.teacherData.permissions,
    errors: state.teacherData.errors
  };
}

export default connect(
  mapStateToProps,
  { removeLoginError }
)(LogIn);
