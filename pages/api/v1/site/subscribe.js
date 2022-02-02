import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import { checkToken } from "../../../../lib/csrf";
import { randomBytes } from "crypto";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (!checkToken(req)) return res.status(403).json({ message: "Invalid CSRF Token" });

	// request must be post
	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
	}

	const email = req.body.email;

	// if no email is provided, return error
	if (!email) {
		res.status(400).json({
			message: "An Email must be provided",
		});

		return;
	}

	// query to check if email already exists
	// prettier-ignore
	let subscriber = await req.db.collection("subscriber").find({ email: email }).toArray();

	// if email already exists, return error
	if (subscriber.length > 0) {
		res.status(400).json({
			message: "Email already subscribed",
		});
		return;
	}

	await req.db.collection("subscriber").insertOne({ email: email });

	// add to log
	await req.db.collection("log").insertOne({
		type: "subscribe",
		email: email,
		date: new Date(),
		unsubscribeToken: randomBytes(32).toString("hex"),
	});

	// return success
	res.status(200).json({
		message: "Subscribed successfully",
	});
});

export default handler;
