const load_bootstrapjs = (document) => {
	// load the cdn script after the page is loaded
	const script = document.createElement("script");
	script.src = "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js";
	script.integrity = "sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM";
	script.crossOrigin = "anonymous";
	document.body.appendChild(script);
};

export default load_bootstrapjs;
