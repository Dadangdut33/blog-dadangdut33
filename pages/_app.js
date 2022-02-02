import "../styles/globals.css";
import { useCookie } from "next-cookie";
import { randomBytes } from "crypto";

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} />;
}

// intialize cookie for the app
MyApp.getInitialProps = async ({ Component, ctx }) => {
	const cookie = useCookie(ctx);
	var rId = cookie.get("rId");
	if (!rId) {
		rId = randomBytes(12).toString("hex");
		cookie.set("rId", rId, { path: "/" });
	}

	return {
		pageProps: {
			...(Component.getInitialProps ? await Component.getInitialProps(ctx) : {}), // pass the page props to the component
		},
	};
};

export default MyApp;
