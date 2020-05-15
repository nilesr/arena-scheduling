var ClassRow = (props) => {
	var name = props.classes[0].name
	var teacher = props.classes[0].teacher
	var blocks = groupBy(props.classes, c => c.block)
	var matching_tickets = props.tickets.filter(t => t.teacher == teacher && t.class_name == name)
	var in_class = matching_tickets.length > 0
	var bspan = <span style={{float: "right"}}>
		{Object.keys(blocks).map(block => {
			var used = props.used_blocks.indexOf(block) >= 0;
			var full = blocks[block][0].remaining_slots <= 0;
			return <span key={block} className={"block " +
				(in_class
					? (block == matching_tickets[0].block ? "green" : "")
					: ((used || full) ? "red" : "")
				)
			}>{block == "P" ? "PM" : block}</span>
		})}
	</span>
	var sections = groupBy(props.classes, c => c.subsection)
	var content = Object.keys(sections).length == 1
		? <Section classes={props.classes} used_blocks={props.used_blocks} onChange={props.onChange} />
		: <div>
			{Object.keys(sections).map(s => {
				return <Expando key={s} type="light" preview={s}>
					<Section classes={sections[s]} used_blocks={props.used_blocks} onChange={props.onChange} />
				</Expando>;
			})}
		</div>
	var preview = <span>{name}<span className="teacher">{teacher}</span>{bspan}</span>;
	return <Expando type={in_class ? "light" : "dark"} preview={preview}>
		{content}
		</Expando>
}
window.ClassRow = ClassRow;
