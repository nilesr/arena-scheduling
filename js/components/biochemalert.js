var biochem = ["AP Biology (Part 1)", "AP Chemistry (Part 1)", "AP Biology (Part 2)", "AP Chemistry (Part 2)"];

var biochem_err = (tickets) => tickets.filter(t => biochem.indexOf(t.class_name) >= 0).length % 2 != 0;

var BioChemAlert = function BioChemAlert(props) {
	if (biochem_err(props.tickets)) {
		return <Alert variant="danger" static={true}>You are not signed up for both blocks of AP Biology or AP Chemistry<br />You must sign up for both blocks.</Alert>;
	}
	return null;
}
window.BioChemAlert = BioChemAlert;
