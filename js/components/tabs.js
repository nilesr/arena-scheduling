var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}
var Tabs = (props) => {
	var [tabi, setTab] = React.useState(0);
	var [cati, setCat] = React.useState(null);
	var tabs = [
		["Gym", <Gym onClick={(cat) => { setTab(1); setCat(cat); }} />],
		["Find Classes", <div><Classes tickets={props.tickets} classes={props.classes} onChange={props.onChange} cat={cati} /><SmallSchedule onChange={props.onChange} tickets={props.tickets} /></div>],
		["Registered Classes", <Schedule tickets={props.tickets} classes={props.classes} onChange={props.onChange} />],
	]
	return <div>
		<div style={{position: "relative"}}>
			{tabs.map((tab, i) => {
				return <a key={i} className={getBtnClass(i, tabi)} onClick={() => { setCat(null); setTab(i); }}>{tabs[i][0]}</a>
			})}
		</div>
		{tabs[tabi][1]}
	</div>;
}

window.Tabs = Tabs;
