import React from "react";

import "../assets/CSS/log_in.css";

class LogIn extends React.Component {
  render() {
    return (
      <div className="login container">
        <div className="login header">
          <h1>Student Grade Table</h1>
        </div>
        <div className="login-boxes">
          <div className="teacher-login container">
            <div className="teacher-login header">
              <h4>Teacher Login</h4>
            </div>
            <form>
              <div className="teacher username-form">
                <label for="teacher-user-name">User Name: </label>
                <input id="teacher-user-name" type="text" />
              </div>
              <div className="teacher password-form">
                <label for="teacher-password">Password: </label>
                <input id="teacher-password" type="text" />
              </div>
            </form>
          </div>

          <div className="student-login container">
            <div className="teacher-login header">
              <h4>Student Login</h4>
            </div>
            <form>
              <div className="student username-form">
                <label for="student-user-name">User Name: </label>
                <input id="student-user-name" type="text" />
              </div>
              <div className="student password-form">
                <label for="student-password">Password: </label>
                <input id="student-password" type="text" />
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LogIn;
