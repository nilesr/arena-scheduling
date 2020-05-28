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

var makepath = function(path, args) {
	if (args == undefined) {
		return path
	}
	
	str = []
	for (let [key, value] of Object.entries(args)) {
		if (value != null) {
			str.push(encodeURIComponent(key) + "=" + encodeURIComponent(value))
		} else {
			str.push(encodeURIComponent(key))
		}
	}

	if (str.length == 0) {
		return path
	}

	let final_path = path + '?' + str.join('&')
	console.log(final_path)
	return final_path
}

window.get = function get(path, args, suc, rej) {
	fetchish("GET", makepath(path, args), undefined, suc, rej);
}
window.post = function post(path, obj, suc, rej) {
	fetchish("POST", path, makefd(obj), suc, rej);
}
window.put = function put(path, obj, suc, rej) {
	fetchish("PUT", path, makefd(obj), suc, rej);
}
window.netDelete = function netDelete(path, args, suc, rej) {
	fetchish("DELETE", makepath(path, args), undefined, suc, rej);
}

