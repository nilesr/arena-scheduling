var Gym = (props) => {
	return <div>
		{catnames.map((cat, cati) => {
			return <a key={cati} className="button" onClick={() => props.onClick(cati)}>{cat}</a>;
		})}
	</div>;
}

window.Gym = Gym
