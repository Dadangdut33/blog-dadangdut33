import NavBar from "../components/navbar";
import Footer from "../components/footer";
import ChromeDinoGame from "react-chrome-dino";
export default function PageNotFound(props) {
	return (
		<main className='d-flex flex-column min-vh-100'>
			<NavBar />
			<div className='m-auto d-flex flex-column' style={{ paddingTop: "6rem" }}>
				<h1 style={{ fontSize: "4rem" }}>Page Not Found</h1>
				{/* button back */}
				<a href='/' className='btn btn-outline-primary mx-auto'>
					<i className='fas fa-arrow-left'></i> Back to Home
				</a>
			</div>
			<ChromeDinoGame />
			<Footer />
		</main>
	);
}
