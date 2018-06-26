import React from "react";
import { connect } from "react-redux";
import {} from "../actions";

import "../assets/CSS/header.css";

class Header extends React.Component {
  render() {
    const { teacherData } = this.props;

    return (
      <div className="header container">
        <h3 className="header title">{`Welcome, ${teacherData.first_name} 
        ${teacherData.last_name}`}</h3>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    teacherData: state.teacherData.teacherData
  };
}
export default connect(
  mapStateToProps,
  {}
)(Header);
