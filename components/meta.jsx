import Head from "next/head";

export default function Meta({ title, description, keywords, author, image, url, siteName, type, date }) {
	return (
		<Head>
			<title>{title}</title>
			<meta charset='UTF-8' />
			<meta name='title' content={title} />
			<meta name='description' content={description} />
			<meta name='keywords' content={keywords} />
			<meta name='author' content={author} />
			<link rel='icon' href='/favicon.ico' />

			<meta property='og:type' content={type} />
			<meta property='og:url' content={url} />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content={image} />
			<meta property='og:site_name' content={siteName} />
			{date ? <meta property='article:published_time' content={date} /> : ``}

			<meta property='twitter:card' content='summary_large_image' />
			<meta property='twitter:url' content={url} />
			<meta property='twitter:title' content={title} />
			<meta property='twitter:description' content={description} />
			<meta property='twitter:image' content={keywords} />
		</Head>
	);
}
