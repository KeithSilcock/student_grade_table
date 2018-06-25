import React from "react";
import StudentList from "./student_list";
import AssignmentsTab from "./assignments";
import Modal from "../modal";
import NewAssignment from "./new_assignment";

class TeacherPortal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalIsOpen: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    const { modalIsOpen } = this.state;
    this.setState({
      ...this.state,
      modalIsOpen: !modalIsOpen
    });
  }

  render() {
    const { clickedStudent, modalIsOpen } = this.state;

    const modalDisplay = modalIsOpen ? (
      <Modal
        modalData={<NewAssignment toggleModal={this.toggleModal} />}
        toggleModal={this.toggleModal}
      />
    ) : null;

    return (
      <div>
        {modalDisplay}
        <h1>Teacher Portal Header</h1>
        <div className="teacher-portal-container">
          <div className="teacher left-container pull-left">
            <StudentList />
          </div>
          <div className="teacher right-container pull-right">
            <AssignmentsTab toggleModal={this.toggleModal} />
          </div>
        </div>
      </div>
    );
  }
}

export default TeacherPortal;
