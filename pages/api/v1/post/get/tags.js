import nextConnect from "next-connect";
import middleware from "../../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
	let tags = await req.db
		.collection("post")
		.aggregate([
			{
				$project: {
					tag: 1,
				},
			},
			{
				$unwind: "$tag",
			},
			{
				$group: {
					_id: "$tag",
					count: { $sum: 1 },
				},
			},
			{
				$sort: {
					count: -1,
				},
			},
		])
		.toArray();

	res.status(200).json(tags);
});

export default handler;
