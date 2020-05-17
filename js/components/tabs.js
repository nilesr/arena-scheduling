var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}
var wrapSection = (s) => <section className="container" id="mainSection">{s}</section>
var Tabs = (props) => {
	var [tabi, setTab] = React.useState(0);
	var [cati, setCat] = React.useState(null);
	var tabs = [
		["Gym", wrapSection(<Gym onClick={(cat) => { setTab(1); setCat(cat); }} />)],
		["Find Classes", <div><Classes tickets={props.tickets} classes={props.classes} onChange={props.onChange} cat={cati} /><SmallSchedule onChange={props.onChange} tickets={props.tickets} /></div>],
		["Registered Classes", wrapSection(<Schedule tickets={props.tickets} classes={props.classes} onChange={props.onChange} />)],
	]
	return <div>
		<section className="container tabs-container">
			{tabs.map((tab, i) => {
				return <a key={i} className={getBtnClass(i, tabi)} onClick={() => { setCat(null); setTab(i); }}>{tabs[i][0]}</a>
			})}
		</section>
		{tabs[tabi][1]}
	</div>;
}

window.Tabs = Tabs;
