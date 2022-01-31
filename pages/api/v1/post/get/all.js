import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	// prettier-ignore
	let posts = await req.db
		.collection("post")
		.find({})
		.skip(1) // skip index 0 -> auto increment flag
		.sort({ id: 1 })
		.toArray();

	res.status(200).json(posts);
});

export default handler;
