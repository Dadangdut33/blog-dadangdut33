import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import { checkToken } from "../../../../lib/csrf";
import { ObjectID } from "bson";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (!checkToken(req)) return res.status(403).send();

	// request must be post
	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
	}

	const email = req.body.email;
	const id = req.body.id;

	// if no email is provided, return error
	if (!email || !id) {
		res.status(400).json({
			message: "An Email and ID must be provided",
		});

		return;
	}

	// delete subscriber
	const status = await req.db.collection("subscriber").deleteOne({ email: email, _id: ObjectID(id) });

	if (status.deletedCount === 0) {
		res.status(400).json({
			message: "Subscriber not found or already unsubscribed",
		});
	} else {
		res.status(200).json({
			message: "Unsubscribed successfully",
		});
	}
});

export default handler;
