import nextConnect from "next-connect";
import { Cookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import middleware from "../../../../../lib/db";
import { checkToken } from "../../../../../lib/csrf";

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
	// check if user is logged in and admin
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;
	if (!admin) {
		res.status(403).json({
			message: "You must be logged in as admin to perform this action",
		});
		return;
	}

	// edit post
	const id = parseInt(req.body.id);

	// prettier-ignore
	let post = await req.db.collection("post")
        .find({ id: id })
        .toArray();

	if (post.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		// prettier-ignore
		await req.db.collection("post").updateOne(
			{ id: id },
			{
				$set: {
					title: req.body.title,
					thumbnail: req.body.thumbnail,
					description: req.body.description,
					content: req.body.content,
					tag: req.body.tag.split(","),
					lastUpdatedAt: new Date(),
				},
			}
		);

		res.status(200).json({
			message: "Post updated",
		});
	}
});

export default handler;
