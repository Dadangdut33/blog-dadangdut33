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
	// check if user is logged in and admin
	if (!cookie.get("user") || !cookie.get("admin")) {
		res.status(403).json({
			message: "You must be logged in as admin to perform this action",
		});
		return;
	}

	// edit post
	const id = parseInt(req.query.id);

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
		await req.db.collection("post").updateOne({ id: id }, { $set: {
            title: req.body.title,
            thumbnail: req.body.thumbnail,
            description: req.body.description,
            content: req.body.content,
            tag: req.body.tag.split(","),
            lastUpdate: new Date(),
        }});

		res.status(200).json({
			message: "Post updated",
		});
	}
});

export default handler;
