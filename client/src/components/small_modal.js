import React from "react";
import { connect } from "react-redux";
import { toggleSmallModal } from "../actions";

import "../assets/CSS/small_modal.css";

export default connect(
  mapStateToProps,
  { toggleSmallModal }
)(props => {
  const { header, content, confirm } = props;
  const cancel = props.cancel ? props.cancel : props.toggleSmallModal;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="warning-modal cant-click-through"
    >
      <div className="warning-modal container">
        <div className="warning-modal header">
          <div className="spacer" />
          <h3>{`${header}`}</h3>
          <span className="close" onClick={e => cancel(props.smallModalIsOpen)}>
            &times;
          </span>
        </div>
        <div className="warning-modal content">{content}</div>
        <div className="warning-modal footer">
          <button onClick={e => confirm(e)} className="standard-button">
            Add
          </button>
          <button
            onClick={e => cancel(props.smallModalIsOpen)}
            className="delete-button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
});
function mapStateToProps(state) {
  return {
    smallModalIsOpen: state.navData.smallModalIsOpen
  };
}
