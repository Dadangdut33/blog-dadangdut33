import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	let posts = await req.db
		.collection("post")
		.find({})
		.project({ upvoter: 0, downvoter: 0, _id: 0 })
		.skip(1) // skip index 0 -> auto increment flag
		.sort({ id: 1 })
		.toArray();

	// reverse it so newver post is on top
	res.status(200).json(posts.reverse());
});

export default handler;
