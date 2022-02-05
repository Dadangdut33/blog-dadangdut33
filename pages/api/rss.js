import { generateRSSFeed } from "../../lib/rss";
import { serverUrl } from "../../lib/server_url";

const handler = async (req, res) => {
	const res_Posts = await fetch(`${serverUrl}/api/v1/post/get/all`, {});
	const data_Posts = await res_Posts.json();
	const rss = generateRSSFeed(data_Posts);

	res.status(200).send(rss);
};

export default handler;
