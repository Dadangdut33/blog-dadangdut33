import { Feed } from "feed";
import { writeFileSync } from "fs";

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

	// if empty create dummy data
	if (articles.length === 0) {
		articles = [
			{
				title: "No post yet",
				description: "No post yet",
				id: 0,
				createdAt: new Date(),
				content: "No post yet",
				author: "Fauzan F A",
			},
		];
	}

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
	// accessible at blog.dadangdut33.codes/rss.xml
	writeFileSync("public/rss.xml", feed.rss2());
};

export { generateRSSFeed };
