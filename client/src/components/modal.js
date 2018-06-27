import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../actions";
import "../assets/CSS/modal.css";

class Modal extends React.Component {
  render() {
    function stopPropigation(e) {
      e.stopPropagation();
    }
    const { toggleModal, modalData, modalIsOpen } = this.props;

    const modalRender = modalIsOpen ? (
      <div className={"display-modal modal-background"} onClick={toggleModal}>
        <div
          className="display-modal modal-frame"
          onClick={e => stopPropigation(e)}
        >
          {modalData}
        </div>
      </div>
    ) : null;

    return modalRender;
  }
}
function mapStateToProps(state) {
  return {
    modalIsOpen: state.teacherData.modalIsOpen
  };
}

export default connect(
  mapStateToProps,
  { toggleModal }
)(Modal);
