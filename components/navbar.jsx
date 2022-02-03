import { useState } from "react";
export default function NavBar() {
	const [searchClick, setSearchClick] = useState(false);

	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom'>
				<div className='container-fluid'>
					<a className='navbar-brand' href='/'>
						Dadangdut33
					</a>
					<button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarText' aria-controls='navbarText' aria-expanded='false' aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon'></span>
					</button>
					<div className='collapse navbar-collapse' id='navbarText'>
						<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
							<li className='nav-item'>
								<a className='nav-link' aria-current='page' href='https://dadangdut33.codes'>
									Home
								</a>
							</li>
							<li className='nav-item'>
								<a className='nav-link active' aria-current='page' href='/'>
									Blog
								</a>
							</li>
						</ul>
						<span className='navbar-text'>
							<input className='form-control me-2 nav-search bg-light text-dark' id='search' type='search' placeholder='Search post 🔎' aria-label='Search' />
						</span>
					</div>
				</div>
			</nav>
		</>
	);
}
