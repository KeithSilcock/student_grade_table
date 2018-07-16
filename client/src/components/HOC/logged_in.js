import React from "react";
import { connect } from "react-redux";

export default function(WrappedComponent) {
  class Auth extends React.Component {
    componentDidMount() {
      if (!this.props.logged_in) {
        this.props.history.push("/login");
      }
    }
    //makes it so that if you aren't authorized, you leave the page.
    componentWillReceiveProps(nextProps) {
      if (!nextProps.logged_in) {
        this.props.history.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    return {
      logged_in: state.loginReducer.logged_in
    };
  }

  return connect(mapStateToProps)(Auth);
}
