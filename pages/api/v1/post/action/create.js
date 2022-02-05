import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";
import { checkToken } from "../../../../../lib/csrf";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	if (!checkToken(req)) return res.status(403).json({ message: "Invalid CSRF Token" });

	if (req.method !== "POST") {
		res.status(400).json({
			message: "Request must be a POST request",
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
		upvoter: [],
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
