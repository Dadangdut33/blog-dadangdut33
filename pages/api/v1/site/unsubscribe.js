import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import { checkToken } from "../../../../lib/csrf";
import { ObjectID } from "bson";

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
	const id = req.body.id;
	const unsubscribeToken = req.body.unsubscribeToken;

	// if no email is provided, return error
	if (!email || !id) {
		res.status(400).json({
			message: "An Email and ID must be provided",
		});

		return;
	}

	// delete subscriber
	const status = await req.db.collection("subscriber").deleteOne({ email: email, _id: ObjectID(id), unsubscribeToken: unsubscribeToken });

	if (status.deletedCount === 0) {
		res.status(400).json({
			message: "Subscriber not found or already unsubscribed",
		});
	} else {
		// add to log
		await req.db.collection("log").insertOne({
			type: "unsubscribe",
			email: email,
			date: new Date(),
		});

		res.status(200).json({
			message: "Unsubscribed successfully",
		});
	}
});

export default handler;
