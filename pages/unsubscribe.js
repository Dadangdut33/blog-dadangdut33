import ErrorPage from "next/error";
import { csrfToken } from "../lib/csrf";

export default function postId(props) {
	return <h1>Status: {props.message}</h1>;
}

// server side rendering
export async function getServerSideProps(context) {
	const { id, email } = context.query;

	if (!id || !email) {
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
