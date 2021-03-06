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


var ExpandoScroll = (props) => {
	return <div className={"expando-wrapper expando-" + props.type}>
		<div className="expando expando-true" style={{cursor: "unset"}}>
			<i className={"expando-carat expandoscroll-carat fa fa-" + (props.icon ? props.icon : "bars")} />
			{props.preview}
		</div>
		<div className="expando-contents" style={{maxHeight: (props.height ? props.height : '70vh'), height: (props.height ? props.height : '70vh'), display: 'flex', flexDirection: 'column', overflowY: 'hidden'}}>{props.children}</div>
	</div>;
}
window.ExpandoScroll = ExpandoScroll;

