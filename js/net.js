var fetchish = function fetchish(method, path, data, suc, rej) {
	var x = new XMLHttpRequest();
	x.onreadystatechange = function() {
		if (x.readyState == 4) {
			if (x.status == 200) {
				suc(JSON.parse(x.responseText))
			} else {
				rej(x.responseText)
			}
		}
	}
	x.withCredentials = true;
	x.open(method, path)
	x.send(data)
}
var makefd = function makefd(obj) {
	var fd = new FormData();
	for (var key of Object.keys(obj)) {
		fd.append(key, obj[key])
	}
	return fd;
}
window.get = function get(path, suc, rej) {
	fetchish("GET", path, undefined, suc, rej);
}
window.post = function post(path, obj, suc, rej) {
	fetchish("POST", path, makefd(obj), succ, rej);
}
window.put = function put(path, obj, suc, rej) {
	fetchish("PUT", path, makefd(obj), succ, rej);
}


