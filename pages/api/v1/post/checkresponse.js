import nextConnect from "next-connect";
import middleware from "../../../../lib/db";
import requestIp from "request-ip";
import { checkToken } from "../../../../lib/csrf";
import { Cookie } from "next-cookie";
import { randomBytes } from "crypto";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (!checkToken(req)) return res.status(403).send();

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
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		if (!rId) {
			rId = randomBytes(12).toString("hex");
			cookie.set("rId", rId);
			setNewRid = true;
		}

		const client = detectedIp + " " + rId;
		let postUpvoter = post[0].upvoter;
		let postDownvoter = post[0].downvoter;

		var message = 0; // 0 = no response, 1 = upvote, 2 = downvote
		if (postUpvoter.includes(client)) {
			message = 1;
		} else if (postDownvoter.includes(client)) {
			message = -1;
		}

		if (!setNewRid) res.status(200).json({ message: message });
		else res.status(200).json({ message: message, cookieValue: cookie.get("rId") });
	}
});

export default handler;
