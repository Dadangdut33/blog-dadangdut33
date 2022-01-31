import { useState, useEffect } from "react";
import { csrfToken } from "../lib/csrf";

export default function page(props) {
	const [testmsg, setTest] = useState("Loading...");

	useEffect(() => {
		fetch("/api/v1/post/upvote", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
				"xsrf-token": props.csrfToken,
			},

			body: JSON.stringify({
				id: 1,
			}),
		})
			.then((response) => response.json())
			.then((data) => setTest(data.message));

		return () => {};
	}, []);

	return (
		<div>
			<h1>Test</h1>
			<p>{testmsg}</p>
		</div>
	);
}

export async function getServerSideProps() {
	return { props: { csrfToken } };
}
