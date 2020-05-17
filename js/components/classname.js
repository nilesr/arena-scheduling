var ClassName = (props) => {
	var c = props.ticket || props.cls
	var n = props.ticket ? c.class_name : c.name;
	return c.subsection == "" ? n : <span>{c.subsection}{props.display_subsection ? <span className="light"> ({n})</span> : null}</span>
}
window.ClassName = ClassName
