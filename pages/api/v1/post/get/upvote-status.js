import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";
import { checkToken } from "../../../../../lib/csrf";
import { Cookie } from "next-cookie";

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
	// const id = parseInt(req.body.id);
	const id = parseInt(req.query.id);

	// prettier-ignore
	let post = await req.db.collection("post")
		.find({ id: id })
		.toArray();

	if (post.length == 0) {
		res.status(200).json({
			message: "Post not found",
		});
	} else {
		let message = 0;

		// add post id to localstorage as array, get the array before first
		let upvotedPosts = cookie.get("upvotedPosts") ? cookie.get("upvotedPosts") : false;
		if (upvotedPosts) {
			if (upvotedPosts.includes(post[0].id)) {
				message = 1;
			}
		}

		res.status(200).json({ message: message });
	}
});

export default handler;
