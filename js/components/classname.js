var ClassName = (props) => {
	var c = props.ticket || props.cls
	var n = props.ticket ? c.class_name : c.name;
	return c.subsection == "" ? n : <span>{c.subsection}<span className="light"> ({n})</span></span>
}
window.ClassName = ClassName
