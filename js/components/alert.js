function Alert(props) {
  const [show, setShow] = React.useState(true);

  if (show) {
    return (
      <div className={"alert alert-" + props.variant}>
        <div className="alert-close" onClick={() => setShow(false)}>&times;</div>
        {props.heading ? <div>{props.heading}</div> : null}
        {props.body}
      </div>
    );
  }
  return null;
}

window.Alert = Alert
