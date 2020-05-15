window.groupBy = function(xs, key) {
	var o = {};
	xs.forEach(x => {
		var k = key(x)
		if (typeof(o[k]) == "undefined")
			o[k] = [x]
		else
			o[k].push(x)
	});
	return o;
};
