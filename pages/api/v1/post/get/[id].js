import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	const id = parseInt(req.query.id);
	const updateView = req.query.updateview ? (req.query.updateview === "false" ? false : true) : true;

	// prettier-ignore
	let post = await req.db
		.collection("post")
		.find({ id: id })
		.project({ _id: 0 })
		.toArray();

	if (post.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		if (updateView && process.env.NODE_ENV !== "development") await req.db.collection("post").updateOne({ id: id }, { $inc: { views: 1 } });

		res.status(200).json(post);
	}
});

export default handler;
