import { useCookie } from "next-cookie";
export default function logout(props) {
	return <h1>Redirecting...</h1>;
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
	cookie.remove("user", { path: "/" });

	// set message
	const msg = {
		status: "success",
		message: "You have been logged out successfully",
	};
	cookie.set("message", JSON.stringify(msg), { path: "/" });

	return {
		redirect: {
			permanent: false,
			destination: `/`,
		},
	};
}
