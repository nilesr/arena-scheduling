var killTicket = function killTicket(id, oc) {
	if (!confirm("Are you ABSOLUTELY sure you would like to remove this class from your schedule? Your spot will be released and may be taken by someone else.")) return;
	netDelete("/tickets/" + id, undefined, oc, (e) => { window.alert("There was an error deleting your ticket: " + e); })
}


