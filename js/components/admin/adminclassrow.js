var AdminClassRow = ({classes, onChange, setCurClass}) => {
	var name = classes[0].name
	var teacher = classes[0].teacher
	var blocks = groupBy(classes, c => c.block)
	var bspan = <span style={{float: "right"}}>
		{Object.keys(blocks).map(block => {
			return <span key={block} className="block">{block == "P" ? "PM" : block}</span>
		})}
	</span>
	var sections = groupBy(classes, c => c.subsection)
	var content = Object.keys(sections).length == 1
		? <AdminSectionList classes={classes} onChange={onChange} setCurClass={setCurClass} />
		: <div>
			{Object.keys(sections).map(s => {
				return <Expando key={s} type="light" preview={s}>
					<AdminSectionList classes={sections[s]} onChange={onChange} setCurClass={setCurClass} />
				</Expando>;
			})}
		</div>
	var preview = <span>{name}<span className="teacher">{teacher}</span>{bspan}</span>;
	return <Expando type="dark" preview={preview}>
		{content}
		</Expando>
}
window.AdminClassRow = AdminClassRow;
