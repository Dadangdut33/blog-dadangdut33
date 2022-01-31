import "../styles/globals.css";
import { csrfToken } from "../lib/csrf";

function MyApp({ Component, pageProps }) {
	return <Component {...pageProps} csrfToken={csrfToken} />;
}

export default MyApp;
