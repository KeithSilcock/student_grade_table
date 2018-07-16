import React from "react";
import { connect } from "react-redux";
import { getStudentData } from "../../actions";

class StudentPortal extends React.Component {
  componentDidMount() {
    //get starting data
    this.props.getStudentData();
  }

  render() {
    return (
      <div>
        <h1>Student Portal</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {}

export default connect(
  mapStateToProps,
  { getStudentData }
)(StudentPortal);
