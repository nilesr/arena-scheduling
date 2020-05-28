function Modal(props) {
  if (!props.open) {
    return null;
  }
  return (
    <div className="modal-wrapper">
      <div className="modal">
        <div className="modal-close" onClick={props.onClose}>&times;</div>
        {props.children}
      </div>
    </div>
  );
}

window.Modal = Modal
