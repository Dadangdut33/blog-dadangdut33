import { serverUrl } from "../../../lib/server_url";
export default function postId(props) {
	return <h1>Redirecting...</h1>;
}

export async function getServerSideProps(context) {
	const { id } = context.query;

	// get data from db based on id ... (later)
	const getPost = await fetch(`${serverUrl}/api/v1/post/get/${id}`);

	if (getPost.status === 404) {
		return {
			notFound: true,
		};
	}

	const post = await getPost.json();
	let title = post[0].title;

	// replace space with dash and encode to url
	title = encodeURIComponent(title.replace(/\s+/g, "-"));

	// redirect to link with title
	return {
		redirect: {
			permanent: false,
			source: `/r/[id]`,
			destination: `/r/${id}/${title}`,
		},
	};
}
