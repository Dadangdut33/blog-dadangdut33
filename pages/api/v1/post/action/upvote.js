import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";
import requestIp from "request-ip";
import { checkToken } from "../../../../../lib/csrf";
import { Cookie } from "next-cookie";
import { randomBytes } from "crypto";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (!checkToken(req)) return res.status(403).json({ message: "Invalid CSRF Token" });

	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
		return;
	}

	const cookie = Cookie.fromApiRoute(req, res);
	var rId = cookie.get("rId");
	var setNewRid = false;
	const id = parseInt(req.body.id);
	const detectedIp = requestIp.getClientIp(req);

	// prettier-ignore
	let post = await req.db.collection("post")
		.find({ id: id })
		.toArray();

	if (post.length == 0) {
		res.status(200).json({
			message: "Post not found",
		});
	} else {
		if (!rId) {
			rId = randomBytes(12).toString("hex");
			cookie.set("rId", rId);
			setNewRid = true;
		}

		const upvoter = detectedIp + " " + rId;
		let postUpvoter = post[0].upvoter;
		let postDownvoter = post[0].downvoter;

		// if the user has downvoted before
		if (postDownvoter.includes(upvoter)) {
			// decrement downvote and remove ip from downvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
				{ id: id },
				{ $inc: { downvote: -1 }, $pull: { downvoter: upvoter } }
			);
		}

		var message = "";
		// if the user has upvoted before
		if (postUpvoter.includes(upvoter)) {
			// decrement upvote and remove ip from upvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
				{ id: id },
				{ $inc: { upvote: -1 }, $pull: { upvoter: upvoter } }
			);
			message = "Upvote removed";
		} else {
			// increase upvote and add ip to upvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
				{ id: id },
				{ $inc: { upvote: 1 }, $push: { upvoter: upvoter } },
			);

			message = "Upvoted";
		}

		if (!setNewRid) res.status(200).json({ message: message });
		else res.status(200).json({ message: message, cookieValue: cookie.get("rId") });
	}
});

export default handler;
