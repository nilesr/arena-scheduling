function Alert(props) {
  const [show, setShow] = React.useState(true);
  if (!show) return null;
  return (
    <div className={"alert alert-" + props.variant}>
      {props.static ? null : <div className="alert-close" onClick={() => setShow(false)}>&times;</div>}
      {props.children}
    </div>
  );
}

window.Alert = Alert
