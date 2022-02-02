import { Feed } from "feed";
const fs = require("fs");

const generateRSSFeed = (articles) => {
	const baseUrl = "https://blog.dadangdut33.codes";
	const author = {
		name: "Fauzan F A",
		email: "contact@dadangdut33.codes",
		link: "https://github.com/Dadangdut33",
	};

	// Construct a new Feed object
	const feed = new Feed({
		title: "Articles by Fauzan F A - Dadangdut33",
		description: "Articles by Fauzan F A, a software engineer and web developer from Indonesia.",
		id: baseUrl,
		link: baseUrl,
		language: "en",
		feedLinks: {
			rss2: `${baseUrl}/rss.xml`,
		},
		author,
	});

	// Add each article to the feed
	articles.forEach((post) => {
		const { content, id, createdAt, description, title } = post;
		const url = `${baseUrl}/${id}/${encodeURIComponent(title.replace(/\s+/g, "-"))}`;

		feed.addItem({
			title,
			id: url,
			link: url,
			description,
			content,
			author: [author],
			date: new Date(createdAt),
		});
	});

	// Write the RSS output to a public file, making it
	// accessible at ashleemboyer.com/rss.xml
	fs.writeFileSync("public/rss.xml", feed.rss2());
};

export { generateRSSFeed };
