import Head from "next/head";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import ChromeDinoGame from "react-chrome-dino";
export default function PageNotFound(props) {
	return (
		<>
			<Head>
				<title>404 - Page Not Found | Dadangdut33 Blog</title>
				<meta charSet='UTF-8' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className='d-flex flex-column min-vh-100'>
				<Navbar />
				<div className='m-auto d-flex flex-column' style={{ paddingTop: "6rem" }}>
					<h1 style={{ fontSize: "4rem" }}>Page Not Found</h1>
					<a href='/' className='btn btn-outline-primary mx-auto'>
						<i className='fas fa-arrow-left'></i> Back to Home
					</a>
				</div>
				<ChromeDinoGame />
				<Footer />
			</main>
		</>
	);
}
