import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";
import { Cookie } from "next-cookie";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
		return;
	}

	const cookie = Cookie.fromApiRoute(req, res);
	const id = parseInt(req.body.id);

	let post = await req.db.collection("post").find({ id: id }).toArray();

	if (post.length == 0) {
		res.status(200).json({
			message: "Post not found",
		});
	} else {
		let message = "";

		// check if post is already upvoted
		let upvotedPosts = cookie.get("upvotedPosts") ? cookie.get("upvotedPosts") : false;
		if (!upvotedPosts) {
			upvotedPosts = [post[0].id];
			await req.db.collection("post").updateOne({ id: id }, { $inc: { upvote: 1 } });

			message = "Upvoted";
		} else {
			if (upvotedPosts.includes(post[0].id)) {
				await req.db.collection("post").updateOne({ id: id }, { $inc: { upvote: -1 } });
				upvotedPosts = upvotedPosts.filter((item) => item !== post[0].id);

				message = "Upvote removed";
			} else {
				await req.db.collection("post").updateOne({ id: id }, { $inc: { upvote: 1 } });
				upvotedPosts.push(post[0].id);

				message = "Upvoted";
			}
		}

		// expiration time is 100 years from now
		cookie.set("upvotedPosts", JSON.stringify(upvotedPosts), { maxAge: 100 * 365 * 24 * 60 * 60, path: "/" });

		res.status(200).json({ message: message, cookieValue: cookie.get("upvotedPosts") });
	}
});

export default handler;
