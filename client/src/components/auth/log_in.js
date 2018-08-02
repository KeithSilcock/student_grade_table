import React from "react";
import LogInForm from "./log_in_form";
import { connect } from "react-redux";
import { removeLoginError } from "../../actions";
import YouTube from "react-youtube";

import "../../assets/CSS/log_in.css";
import "../../assets/CSS/animations/login_fail.css";

class LogIn extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      studentShown: false
    };
  }

  componentDidMount() {
    document.title = "Login";
    if (this.props.match.path !== "/login") {
      this.props.history.push("/login");
    }
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

  switchUserLogin() {
    const { studentShown } = this.state;
    this.setState({
      ...this.state,
      studentShown: !studentShown
    });
  }

  render() {
    const { hasError, studentShown } = this.state;

    const sliderStyle = studentShown
      ? { transform: "translateX(41px)" }
      : { transform: "translateX(0px)" };
    const sliderTextStyle = studentShown
      ? { transform: "translateX(100px)" }
      : { transform: "translateX(-90px)" };
    const sliderText = studentShown ? "Administrator" : "Student";

    const loginPortal = studentShown ? (
      <div className="teacher-login body">
        <LogInForm
          clearError={this.clearError.bind(this)}
          hasError={hasError}
          userType={"Administrator"}
        />
        <div onClick={e => this.switchUserLogin()} className="switch-box">
          <span style={sliderTextStyle} className="slider-text">
            {sliderText}
          </span>
          <div className={`slider-container ${sliderText}`}>
            <div style={sliderStyle} className="slider">
              <i className="fas fa-chalkboard-teacher" />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div className="student-login body">
        <LogInForm
          clearError={this.clearError.bind(this)}
          hasError={hasError}
          userType={"Student"}
        />
        <div onClick={e => this.switchUserLogin()} className="switch-box">
          <span style={sliderTextStyle} className="slider-text">
            {sliderText}
          </span>
          <div className={`slider-container ${sliderText}`}>
            <div className="slider">
              <i className="fas fa-user-graduate" />
            </div>
          </div>
        </div>
      </div>
    );

    const youtubeOpts = {
      height: "315",
      width: "560"
    };

    return (
      <div className="login container">
        <div className="login header">
          <a
            className="login logo"
            href="https://keithsilcock.com"
            target="_blank"
          />
          <h1>Education Web Portal</h1>
          <div className="login spacer" />
        </div>
        <div className="teacher-login container">
          <div className="login-top">
            <div className="youtube-box">
              <p className="youtube-text bold">
                Feel free to log in as either a student or an administrator
              </p>
              <p className="youtube-text bold">
                Or if you're short on time, you can watch my overview below
              </p>
              <YouTube
                opts={youtubeOpts}
                id="login-video"
                containerClassName="video-span"
                videoId="wKkfEik21RY"
              />
            </div>
            {loginPortal}
          </div>
          <div className="login-bottom">
            <p>
              This application was designed as a web portal for teachers and
              students to create and view their course assignments.
            </p>
            <p>
              Teachers can{" "}
              <span className="bold">Create, Read, Update and Delete</span>{" "}
              assignments and grades while students may only{" "}
              <span className="bold">read</span> their assignment scores and
              comments left by the teacher. You may log in above as a student or
              an administrator. The login credentials for each have been
              provided temproarily. Thank you for visting!
            </p>
            <p>
              The technologies used to create this application were ReactJS,
              ReduxJS and NodeJS.
            </p>
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
