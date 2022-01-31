import { useState, useEffect } from "react";

import { csrfToken } from "../lib/csrf";

const Home = ({ csrfToken }) => {
	const [user, setUser] = useState("Guest");

	useEffect(() => {
		fetch("/api/hello", { headers: { "xsrf-token": csrfToken } })
			.then((response) => response.json())
			.then((data) => setUser(data.name));

		return () => {};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div>Hello {user}!</div>;
};

const getServerSideProps = async () => {
	return { props: { csrfToken } };
};

export default Home;
export { getServerSideProps };
