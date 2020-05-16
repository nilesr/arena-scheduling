var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}
var Tabs = (props) => {
	var [tabi, setTab] = React.useState(0);
	var tabs = [
		["Find Classes", <div><Classes tickets={props.tickets} classes={props.classes} onChange={props.onChange} /><SmallSchedule tickets={props.tickets} /></div>],
		["Registered Classes", <Schedule tickets={props.tickets} classes={props.classes} onChange={props.onChange} />],
	]
	return <div>
		<div style={{position: "relative"}}>
			{tabs.map((tab, i) => {
				return <a key={i} className={getBtnClass(i, tabi)} onClick={() => setTab(i)}>{tabs[i][0]}</a>
			})}
		</div>
		{tabs[tabi][1]}
	</div>;
}

window.Tabs = Tabs;
