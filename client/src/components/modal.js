import React from "react";
import "../assets/CSS/modal.css";

class Modal extends React.Component {
  render() {
    function stopPropigation(e) {
      e.stopPropagation();
    }
    const { toggleModal, modalData } = this.props;
    return (
      <div className={"display-modal modal-background"} onClick={toggleModal}>
        <div className="display-modal modal-frame" onClick={e => stopPropigation(e)}>
          {modalData}
        </div>
      </div>
    );
  }
}

export default Modal;
