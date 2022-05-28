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
	// check if user is logged in and admin-
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
	const post = {
		title: req.body.title,
		thumbnail: req.body.thumbnail,
		description: req.body.description,
		content: req.body.content,
		tag: req.body.tag.split(","),
		createdAt: new Date(),
	};

	// insert into post collection
	await req.db.collection("post").insertOne(post);

	// delete from draft collection
	const _id = parseInt(req.body._id);
	await req.db.collection("draft").deleteOne({ _id });

	res.status(200).json({
		message: "Draft created",
	});
});

export default handler;
