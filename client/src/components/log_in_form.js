import React from "react";
import { connect } from "react-redux";
import { login } from "../actions";

class LogInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_name: "ghi789",
      password: "abc123456"
    };
  }

  handleOnChange(e) {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    this.props.login(this.state);
  }

  render() {
    const { user_name, password } = this.state;
    return (
      <form onSubmit={e => this.handleOnSubmit(e)}>
        <div className="header">
          <h4>
            <i className="fas fa-door-open" />Welcome, {this.props.userType}!
          </h4>
          <h6>Please Login Below!</h6>
        </div>
        <div className="login-form-inputs">
          <div className="login username-form">
            <label>User Name: </label>
            <input
              onChange={e => this.handleOnChange(e)}
              name="user_name"
              type="text"
              value={user_name}
            />
          </div>
          <div className="login password-form">
            <label>Password: </label>
            <input
              onChange={e => this.handleOnChange(e)}
              name="password"
              type="password"
              value={password}
            />
          </div>
        </div>
        <div className="login-actions">
          <button className="login-form standard-button">
            <i className="fas fa-key" /> Log In
          </button>
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  { login }
)(LogInForm);
