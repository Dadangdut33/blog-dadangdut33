import ErrorPage from "next/error";
export default function postId({ statusCode }) {
	return <ErrorPage statusCode={statusCode} />;
}

// server side rendering
export async function getServerSideProps(context) {
	const { id } = context.query;

	if (isNaN(id)) {
		// return error code
		return {
			props: {
				statusCode: 404,
			},
		};
	} else {
		// get data from db based on id ... (later)

		var title = "test temp title";

		// if not found, return error page

		// replace space with dash and encode to url
		title = encodeURIComponent(title.replace(/\s+/g, "-"));

		// redirect to link with title
		return {
			redirect: {
				permanent: false,
				source: `/[id]`,
				destination: `/${id}/${title}`,
			},
		};
	}
}
