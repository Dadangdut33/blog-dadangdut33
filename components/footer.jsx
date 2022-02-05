export default function Footer() {
	const currYear = new Date().getFullYear();

	return (
		<footer className='text-center mt-auto'>
			<div className='container pt-1 border-top'>
				<section className='mb-1 footer-icon'>
					<a className='btn btn-link btn-floating btn-lg m-1 shadow-none' href='https://www.linkedin.com/in/fauzan-farhan-antoro/' target={"_blank"} rel='noopener noreferrer' role='button'>
						<i className='fab fa-linkedin'></i>
					</a>
					<a className='btn btn-link btn-floating btn-lg m-1 shadow-none' href='https://github.com/Dadangdut33' target={"_blank"} rel='noopener noreferrer' role='button'>
						<i className='fab fa-github'></i>
					</a>
					<a className='btn btn-link btn-floating btn-lg m-1 shadow-none' href='https://ko-fi.com/dadangdut33' target={"_blank"} rel='noopener noreferrer' role='button'>
						<i className='fas fa-coffee'></i>
					</a>
					<a className='btn btn-link btn-floating btn-lg m-1 shadow-none' href='mailto:contact@dadangdut33.codes' role='button'>
						<i className='far fa-envelope'></i>
					</a>
				</section>
			</div>

			<div className='text-center p-3 pt-1'>© {currYear} Dadangdut33</div>
		</footer>
	);
}
