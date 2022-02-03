import { useState } from "react";
import DarkModeToggle from "./theme-switcher/DarkModeToggle";

export default function NavBar() {
	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-light bg-light border-bottom'>
				<div className='container-fluid'>
					<span className='navbar-brand mb-0 h1'>
						<a className='navbar-brand' href='https://dadangdut33.codes' style={{ marginRight: "0" }}>
							Dadangdut33{" "}
						</a>
						<span className='text-muted'>
							<a href='/' className='link-nodecor'>
								- Blog
							</a>
						</span>
					</span>

					<button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarText' aria-controls='navbarText' aria-expanded='false' aria-label='Toggle navigation'>
						<span className='navbar-toggler-icon'></span>
					</button>
					<div className='collapse navbar-collapse' id='navbarText'>
						<ul className='navbar-nav me-auto mb-2 mb-lg-0'>
							<li className='nav-item'> </li>
						</ul>
						<DarkModeToggle />
					</div>
				</div>
			</nav>
		</>
	);
}
