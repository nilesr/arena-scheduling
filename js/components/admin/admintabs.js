var getBtnClass = function getBtnClass(i, tabi) {
	var r = "button button-large tabbutton"
	if (i != tabi) r += " button-outline"
	return r;
}
var wrapSection = (s) => <section className="container" id="mainSection">{s}</section>
var AdminTabs = (props) => {
	var [tabi, setTab] = React.useState(0);
	var [cati, setCat] = React.useState(null);
	var tabs = [
		["Class Rosters", <div>Rosters</div>],
		["Students", <div>Students</div>],
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

window.AdminTabs = AdminTabs;
