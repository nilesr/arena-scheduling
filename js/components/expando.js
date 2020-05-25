var Expando = (props) => {
	var [open, swap] = React.useState(props.open !== undefined ? props.open : false);
	return <div className={"expando-wrapper expando-" + props.type}>
		<div className={"expando expando-" + open} onClick={() => swap(!open)}>
			<i className={"expando-carat fa fa-caret-" + (open ? "down" : "right")} />
			{props.preview}
		</div>
		{open ? <div className="expando-contents">{props.children}</div> : null}
	</div>;
}
window.Expando = Expando;

