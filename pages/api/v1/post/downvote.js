import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import requestIp from "request-ip";
import { checkToken } from "../../../../lib/csrf";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (!checkToken(req)) return res.status(401).send();

	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
		return;
	}

	const id = parseInt(req.body.id);
	const detectedIp = requestIp.getClientIp(req);

	// prettier-ignore
	let post = await req.db.collection("post")
		.find({ id: id })
		.toArray();

	if (post.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		let postUpvoter = post[0].upvoter;
		let postDownvoter = post[0].downvoter;

		// if the user has upvoted before
		if (postUpvoter.includes(detectedIp)) {
			// decrement upvote and remove ip from upvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
                { id: id },
                { $inc: { upvote: -1 }, $pull: { upvoter: detectedIp } }
            );
		}

		// if the user has downvoted before
		if (postDownvoter.includes(detectedIp)) {
			// decrement downvote and remove ip from downvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
                { id: id },
                { $inc: { downvote: -1 }, $pull: { downvoter: detectedIp } }
            );

			res.status(200).json({
				message: "Downvote removed",
			});
		} else {
			// increase downvote and add ip to downvoter array
			// prettier-ignore
			await req.db.collection("post").updateOne(
                { id: id },
                { $inc: { downvote: 1 }, $push: { downvoter: detectedIp } },
            );

			res.status(200).json({
				message: "Downvoted",
			});
		}
	}
});

export default handler;
