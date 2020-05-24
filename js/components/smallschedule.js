var PADDING=5;

var addedCourses = [];

function computeDimensions(block) {
  var w = 0;
  var h = 0;
  var x = 0;
  var y = 0;
  //var w0 = document.getElementById("smallschedule").offsetWidth;
	//var h0 = (2449/1970)*w0;
  var dims = [];
  if(block == "A") {
		var w0 = document.getElementById("smallschedule").offsetWidth;
		var h0 = (2449/1970)*w0;
    x += (178/1970)*w0;
    y += (344/2449)*h0;
    w = (358/1970)*w0;
    h = (264/2449)*h0;
    for(var i = 0; i < 5; i++) {
      if(i != 1) dims.push({width: w - PADDING, height: h - PADDING, left: x + i*w + PADDING/2, top: y + PADDING/2});
    }
  }
  return dims
}

var SmallSchedule = (props) => {
	return <div className="smallschedule" id="smallschedule">
		<img src="./schedule.png" style={{position: "absolute"}} />
		<div className="coursechip" style={{width: "50%"}}>a</div>
		{/*<div className="coursechip" style={computeDimensions("A")[0]}>hello</div>*/}
		{/*props.tickets.map((ticket) => {
			if(ticket.block == "A") {
				return <div className="coursechip" style={computeDimensions("A")[0]}>hello</div>
			}
		})*/}
	</div>
	/*return <div className="smallschedule">
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
	</div>;*/
}
window.SmallSchedule = SmallSchedule;
