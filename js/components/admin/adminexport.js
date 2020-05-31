var AdminExport = function AdminExport() {
	return <section className="container">
		Student schedules are exported as one giantic spreadsheet, which can be opened in Excel. <br />
		<a href="/teacher/export" download={true} className="button">Download All Schedules (successful & waitlist)</a>
		<br />
		Comments, such as students who need to take career center classes, are exported to a different spreadsheet<br />
		<a href="/teacher/export_comments" download={true} className="button">Download Comments</a>
	</section>;
}
window.AdminExport = AdminExport;
