import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import { checkToken } from "../../../../lib/csrf";
import { Cookie } from "next-cookie";
import AES from "crypto-js/aes";
const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	// if (!checkToken(req)) return res.status(403).json({ message: "Invalid CSRF Token" });

	// if (req.method !== "POST") {
	// 	res.status(400).json({
	// 		message: "Request must be a POST request",
	// 	});
	// 	return;
	// }

	var CryptoJS = require("crypto-js");

	// check if user exists
	if (!req.cookies.user) {
		// user not logged in
		res.status(403).json({
			message: "User not logged in",
		});
		return;
	}

	// decrypt user cookie
	const user = JSON.parse(AES.decrypt(req.cookies.user, process.env.SESSION_PASSWORD).toString(CryptoJS.enc.Utf8));

	// check if user exists
	if (!user) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}

	// destroy session cookie
	const cookie = Cookie.fromApiRoute(req, res);
	cookie.remove("user", { path: "/" });

	res.status(200).json({
		message: "Logged out successfully",
	});
});

export default handler;
