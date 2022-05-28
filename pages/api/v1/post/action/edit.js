import nextConnect from "next-connect";
import { Cookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
	// --------------------------------------------------
	// must be post request
	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
		});
		return;
	}

	// --------------------------------------------------
	// check if user is logged in and admin
	const cookie = Cookie.fromApiRoute(req, res);
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;
	if (!admin) {
		res.status(403).json({
			message: "You must be logged in as admin to perform this action",
		});
		return;
	}

	// verify admin in db
	let userFound = req.db
		.collection("user")
		.find({
			username: JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).username,
			admin: JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin ? "Admin" : "User",
		})
		.toArray();

	if (userFound.length == 0) {
		res.status(403).json({
			message: "You must be logged in as admin to perform this action",
		});
		return;
	}
	// --------------------------------------------------
	// edit post by id
	const id = parseInt(req.body.id);

	let post = await req.db.collection("post").find({ id: id }).toArray();

	if (post.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
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
