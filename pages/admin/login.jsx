import Head from "next/head";
import { useCookie } from "next-cookie";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { csrfToken } from "../../lib/csrf";

export default function Login({ csrfToken }) {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [msgNotif, setMsgNotif] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		const toastId = toast.loading("Logging in...");

		if (!username || !password) {
			setMsgNotif("Please fill in all the fields");
			toast.update(toastId, {
				render: "Please fill in all the fields",
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 2000,
			});
			return;
		}

		const data = {
			username: username,
			password: password,
		};

		const req = await fetch("/api/v1/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"xsrf-token": csrfToken,
			},
			body: JSON.stringify(data),
		});

		const res = await req.json();

		if (req.status === 200) {
			setMsgNotif("Successfully logged in!");
			toast.update(toastId, {
				render: "Logged in succesfully!",
				type: toast.TYPE.SUCCESS,
				isLoading: false,
			});
			setTimeout(() => {
				window.location.href = "/admin/dashboard";
			}, 1500);
		} else {
			setMsgNotif("Error: " + res.message);
			toast.update(toastId, {
				render: "Error: " + res.message,
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 3000,
			});
		}
	};

	useEffect(() => {
		document.body.classList.add("admin-dashboard");
	});

	return (
		<>
			<Head>
				<title>Admin Login | Dadangdut33 Blog</title>
				<meta charSet='UTF-8' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='container login-wrap panel-login'>
				<div className='row'>
					<div className='col-lg-3 col-md-2'></div>
					<div className='col-lg-6 col-md-8 login-box panel-login'>
						<div className='col-lg-12 login-key panel-login'>
							<i className='fas fa-key pt-4' aria-hidden='true'></i>
						</div>
						<div className='col-lg-12 login-title panel-login'>Admin</div>

						<div className='col-lg-12 login-form panel-login'>
							<div className='col-lg-12 login-form panel-login'>
								<form>
									<div className='form-group panel-login'>
										<label className='form-control-label panel-login'>USERNAME</label>
										<input type='text' className='form-control panel-login' value={username} onInput={(e) => setUsername(e.target.value)} required={true} />
									</div>
									<div className='form-group panel-login'>
										<label className='form-control-label panel-login'>PASSWORD</label>
										<input type='password' className='form-control panel-login' value={password} onInput={(e) => setPassword(e.target.value)} required={true} />
									</div>

									<div className='col-lg-12 loginbttm panel-login'>
										<div className='col-lg-6 login-btm login-text panel-login'>{msgNotif ? msgNotif : "‏‏‎ ‎"}</div>
										<div className='col-lg-6 login-btm login-button panel-login'>
											‏‏‎ ‎
											<button type='submit' className='btn btn-outline-primary panel-login' id='login' onClick={handleSubmit}>
												LOGIN
											</button>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</main>

			<ToastContainer
				position='bottom-center'
				autoClose={2250}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover={false}
				theme={"dark"}
			/>
		</>
	);
}

export async function getServerSideProps(context) {
	const cookie = useCookie(context);
	if (cookie.get("user")) {
		return {
			redirect: {
				permanent: false,
				destination: `/admin/dashboard`,
			},
		};
	}

	return {
		props: {
			csrfToken: csrfToken,
		},
	};
}
