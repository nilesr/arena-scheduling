window.get = function get(path, suc, rej) {
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
	x.open("GET", path)
	x.send()
}
window.post = function post(path, obj, suc, rej) {
	var fd = new FormData();
	for (var key of Object.keys(obj)) {
		fd.append(key, obj[key])
	}
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
	x.open("POST", path)
	x.send(fd)
}

