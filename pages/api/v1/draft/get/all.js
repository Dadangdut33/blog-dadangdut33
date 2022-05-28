import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	// get all drafts
	let posts = await req.db.collection("draft").find({}).sort({ createdAt: 1 }).toArray();

	// reverse it so newer draft is on top
	res.status(200).json(posts.reverse());
});

export default handler;
