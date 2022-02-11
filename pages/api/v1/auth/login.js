import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import { Cookie } from "next-cookie";
import AES from "crypto-js/aes";
import { enc } from "crypto-js/core";
const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
		return;
	}

	// get user from db
	const user = await req.db.collection("user").findOne({
		username: req.body.username,
	});

	// check if user exists
	if (!user) {
		res.status(403).json({
			message: "User or password is incorrect!",
		});
		return;
	}

	// get key from db
	const key = await req.db.collection("key").findOne({});

	// decrypt db password and compare
	const decrypted = AES.decrypt(user.password, key.key);
	const originalText = decrypted.toString(enc.Utf8);

	if (originalText !== req.body.password) {
		res.status(403).json({
			message: "User or password is incorrect!",
		});
		return;
	}

	// create session cookie store as json object
	const cookie = Cookie.fromApiRoute(req, res);
	const sessionData = {
		username: user.username,
		admin: user.role === "Admin" ? true : false,
	};

	// encrypt session data
	const encrypted = AES.encrypt(JSON.stringify(sessionData), process.env.SESSION_PASSWORD);

	cookie.set("user", encrypted.toString(), { maxAge: 14 * 24 * 60 * 60, path: "/" });

	res.status(200).json({
		message: "Login successful",
		cookieValue: cookie.get("user"),
	});
});

export default handler;
