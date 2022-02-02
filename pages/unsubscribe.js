import { csrfToken } from "../lib/csrf";
import ErrorPage from "next/error";

export default function postId(props) {
	if (props.statusCode) {
		return <ErrorPage statusCode={props.statusCode} />;
	}

	return <h1>Status: {props.message}</h1>;
}

// server side rendering
export async function getServerSideProps(context) {
	const { id, email, unsubscribeToken } = context.query; // GET params

	if (!id || !email || !unsubscribeToken) {
		// return error code
		return {
			props: {
				statusCode: 403,
			},
		};
	} else {
		// fetch api with post request
		const response = await fetch(`http://localhost:3000/api/v1/site/unsubscribe`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"xsrf-token": csrfToken,
			},
			body: JSON.stringify({
				email: email,
				id: id,
				unsubscribeToken: unsubscribeToken,
			}),
		});

		const data = await response.json();

		return {
			props: {
				message: data.message,
			},
		};
	}
}
