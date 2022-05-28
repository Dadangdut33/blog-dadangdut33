import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	// GET the draft by _id
	const _id = parseInt(req.query._id);
	let draft = await req.db.collection("draft").find({ _id: _id }).toArray();

	if (draft.length == 0) {
		res.status(404).json({
			message: "Post not found",
		});
	} else {
		res.status(200).json(draft);
	}
});

export default handler;
