import React from "react";
import { connect } from "react-redux";
import { logout } from "../actions";

class LogOut extends React.Component {
  componentDidMount() {
    this.props.logout();
  }
  render() {
    return (
      <div>
        <h1>Logging you out!</h1>
        <h1>Have a Nice Day! :)</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default connect(
  mapStateToProps,
  { logout }
)(LogOut);
