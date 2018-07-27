import React from "react";
import { connect } from "react-redux";
import { login, removeLoginError } from "../../actions";

class LogInForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user_name: "",
      password: ""
    };
  }

  componentDidMount() {
    switch (this.props.userType) {
      case "Administrator":
        this.setState({
          ...this.state,
          user_name: "hio985",
          password: "abc123456"
        });
        break;
      default:
        this.setState({
          ...this.state,
          user_name: "abc123",
          password: "abc123456"
        });

        break;
    }
  }

  handleOnChange(e) {
    const { name, value } = e.target;
    this.props.clearError();

    this.setState({
      ...this.state,
      [name]: value
    });
  }

  handleOnSubmit(e) {
    e.preventDefault();
    this.props.clearError();
    this.props.login(this.state);
  }

  render() {
    const { user_name, password } = this.state;
    const { hasError } = this.props;

    const errorMessage = hasError ? (
      <div className="login fail">
        <p>Sorry your password or user ID is incorrect</p>
      </div>
    ) : null;

    const incorrectFieldClass = hasError ? "invalid-shake" : null;

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
              className={`${incorrectFieldClass}`}
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
          {errorMessage}
        </div>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return { removeLoginError };
}

export default connect(
  mapStateToProps,
  { login }
)(LogInForm);
