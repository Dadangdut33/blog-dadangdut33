import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	const id = parseInt(req.query.id);

	// prettier-ignore
	let post = await req.db
		.collection("post")
		.find({ id: id })
		.project({ upvoter: 0, downvoter: 0, _id: 0 })
		.toArray();

	if (post.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		// increment view
		await req.db.collection("post").updateOne({ id: id }, { $inc: { views: 1 } });

		res.status(200).json(post);
	}
});

export default handler;
