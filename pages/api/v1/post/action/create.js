import nextConnect from "next-connect";
import { Cookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import middleware from "../../../../../lib/db";

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
	// check if user is logged in and admin
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;
	if (!admin) {
		res.status(403).json({
			message: "You must be logged in as admin to perform this action",
		});
		return;
	}

	// insert into post collection
	const post = {
		title: req.body.title,
		thumbnail: req.body.thumbnail,
		description: req.body.description,
		content: req.body.content,
		tag: req.body.tag.split(","),
		upvote: 0,
		views: 0,
		createdAt: new Date(),
	};

	// prettier-ignore
	await req.db.collection("post").insertOne(post);

	res.status(200).json({
		message: "Post created",
	});
});

export default handler;
