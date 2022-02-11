function validURL(str) {
	//Check if it's a valid url or not
	var pattern = new RegExp(
		"^(https?:\\/\\/)?" + // protocol
			"((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
			"((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
			"(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
			"(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
			"(\\#[-a-z\\d_]*)?$",
		"i"
	); // fragment locator

	var res = !!pattern.test(str);

	// check if it's a valid image url
	if (res) {
		var ext = str.split(".").pop();
		if (ext != "png" && ext != "jpg" && ext != "jpeg" && ext != "gif") {
			res = false;
		}
	}

	return res;
}

export default validURL;
