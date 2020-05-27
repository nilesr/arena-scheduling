var AdminExport = function AdminExport() {
	return <section className="container">
		Student schedules are exported as one giantic spreadsheet, which can be opened in Excel. <br />
		<a href="/teacher/export" download={true} className="button">Download All</a>
	</section>;
}
window.AdminExport = AdminExport;
