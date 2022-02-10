import { useCookie } from "next-cookie";
import { useEffect } from "react";
export default function Logout({ cookie }) {
	const cookies = useCookie(cookie);

	useEffect(() => {
		const msg = {
			status: "success",
			message: "You have logged out successfully",
		};
		cookies.set("message", JSON.stringify(msg), { path: "/" });

		window.location.href = "/";
	}, []);

	return <h1>Successfully logged out! Redirecting...</h1>;
}

export async function getServerSideProps(context) {
	const cookie = useCookie(context);
	if (!cookie.get("user")) {
		// redirect /
		const msg = {
			status: "error",
			message: "You are not logged in",
		};
		cookie.set("message", JSON.stringify(msg), { path: "/" });
		return {
			redirect: {
				permanent: false,
				destination: `/`,
			},
		};
	}

	// destroy session cookie
	cookie.remove("user", { path: "/" }); // cannot set cookie after remove for some reason

	return {
		props: {
			cookie: cookie.get("user"),
		},
	};
}
