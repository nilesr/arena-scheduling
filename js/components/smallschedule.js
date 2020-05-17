var SmallSchedule = (props) => {
	return <div className="smallschedule">
		{Array.prototype.slice.call("ABCDEFGHP", 0).map(block => {
			var ts = props.tickets.filter(t => t.block == block)
			var t = ts.length == 0 ? null : ts[0];
			return <div key={block} className={"ss-block ss-block-" + (t ? "filled" : "empty")}>
				{block == "P" ? "PM" : block}
				{t
					? [
						<span key={1} className="ss-class-name">{t.subsection == "" ? t.class_name : t.subsection}</span>,
						<span key={2} className="ss-sub">{t.teacher}</span>,
						<a key={3} className="ss-del button" onClick={() => killTicket(t.id, props.onChange)}>×</a>,
					]
					: null}
			</div>;
		})}
	</div>;
}
window.SmallSchedule = SmallSchedule;
