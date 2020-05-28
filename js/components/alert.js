function Alert(props) {
    const [show, setShow] = React.useState(true);
  
    if (show) {
      return (
        <ReactBootstrap.Alert variant={props.variant} onClose={() => setShow(false)} dismissible>
          {props.heading ? <ReactBootstrap.Alert.Heading>{props.heading}</ReactBootstrap.Alert.Heading> : ''}
          {props.body}
        </ReactBootstrap.Alert>
      );
    }
    return null;
  }

window.Alert = Alert