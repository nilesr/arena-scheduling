var ClassRow = ({classes, tickets, onChange, used_blocks}) => {
	var name = classes[0].name
	var teacher = classes[0].teacher
	var blocks = groupBy(classes, c => c.block)
	var matching_tickets = tickets.filter(t => t.teacher == teacher && t.class_name == name)
	var in_class = matching_tickets.length > 0
	var bspan = <span style={{float: "right"}}>
		{Object.keys(blocks).map(block => {
			var used = used_blocks.indexOf(block) >= 0;
			var remaining_slots = blocks[block][0].remaining_slots;
			var full = remaining_slots <= 0;
			return <span key={block} className={"block " +
				(in_class
					? (block == matching_tickets[0].block ? "green" : "")
					: ((used || full)
						? "red"
						: (remaining_slots <= 5
							? "gold"
							: ""))
				)
			}>{block == "P" ? "PM" : block}</span>
		})}
	</span>
	var sections = groupBy(classes, c => c.subsection)
	var content = Object.keys(sections).length == 1
		? <SectionList classes={classes} tickets={tickets} used_blocks={used_blocks} onChange={onChange} />
		: <div>
			{Object.keys(sections).map(s => {
				return <Expando key={s} type="light" preview={s}>
					<SectionList classes={sections[s]} tickets={tickets} used_blocks={used_blocks} onChange={onChange} />
				</Expando>;
			})}
		</div>
	var preview = <span>{name}<span className="teacher">{teacher}</span>{bspan}</span>;
	return <Expando type={in_class ? "light" : "dark"} preview={preview}>
		{content}
		</Expando>
}
window.ClassRow = ClassRow;
