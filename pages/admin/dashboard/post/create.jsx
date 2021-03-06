import { ToastContainer, toast } from "react-toastify";
import Head from "next/head";
import { useCookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { serverUrl } from "../../../../lib/server_url";
import Markdown from "../../../../components/markdown/Markdown";
import DarkModeToggle from "../../../../components/theme-switcher/DarkModeToggle";
import validImageURL from "../../../../lib/checkImage";

export default function CreatePost(props) {
	const [title, setTitle] = useState("");
	const [thumbnail, setThumbnail] = useState("");
	const [tags, setTags] = useState("");
	const [description, setDescription] = useState("");
	const [content, setContent] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [popupMsg, setPopupMsg] = useState("");
	const [theme, setTheme] = useState("light");

	const resetForm = () => {
		setTitle("");
		setThumbnail("");
		setTags("");
		setDescription("");
		setContent("");
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	const uploadPost = async () => {
		const toastId = toast.loading("Submitting...");

		// check empty is not allowed
		if (title === "" || thumbnail === "" || tags === "" || description === "" || content === "") {
			toast.update(toastId, {
				render: "Please fill all the required fields.",
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 1500,
			});
			return;
		}

		// validate thumbnail
		if (!validImageURL(thumbnail)) {
			toast.update(toastId, {
				render: "Thumbnail is not a valid image URL.",
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 1500,
			});
			return;
		}

		const data = {
			title: title,
			thumbnail: thumbnail,
			description: description,
			content: content,
			tag: tags === "" ? [] : tags.split(","),
		};

		const req = await fetch(`${serverUrl}/api/v1/post/action/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const res = await req.json();

		if (req.status === 200) {
			toast.update(toastId, {
				render: "Post created successfully.",
				type: toast.TYPE.SUCCESS,
				isLoading: false,
				autoClose: 1500,
			});
			resetForm();
			window.onbeforeunload = null;

			setTimeout(() => {
				window.location.href = "/admin/dashboard";
			}, 1500);
		} else {
			toast.update(toastId, {
				render: `Err: ${res.message}`,
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 1500,
			});
		}
	};

	const saveDraft = async () => {
		const toastId = toast.loading("Saving as draft...");

		// check empty is not allowed
		if (title === "" || description === "") {
			toast.update(toastId, {
				render: "Draft must have at least title and description provided.",
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 1500,
			});
			return;
		}

		// validate thumbnail
		if (thumbnail !== "") {
			if (!validImageURL(thumbnail)) {
				toast.update(toastId, {
					render: "Thumbnail is not a valid image URL.",
					type: toast.TYPE.ERROR,
					isLoading: false,
					autoClose: 1500,
				});
				return;
			}
		}

		const data = {
			title: title,
			thumbnail: thumbnail,
			description: description,
			content: content,
			tag: tags === "" ? [] : tags.split(","),
		};

		const req = await fetch(`${serverUrl}/api/v1/draft/action/create`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		const res = await req.json();

		if (req.status === 200) {
			toast.update(toastId, {
				render: "Draft created successfully.",
				type: toast.TYPE.SUCCESS,
				isLoading: false,
				autoClose: 1500,
			});
			resetForm();
			window.onbeforeunload = null;

			setTimeout(() => {
				window.location.href = "/admin/dashboard";
			}, 1500);
		} else {
			toast.update(toastId, {
				render: `Err: ${res.message}`,
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 1500,
			});
		}
	};

	const notify = (message) => {
		toast.success(message);
	};

	useEffect(() => {
		document.body.classList.add("admin-dashboard");

		let intervalBg = setInterval(() => {
			if (document.body.classList.contains("bg-dark")) {
				setTheme("dark");
			} else {
				setTheme("light");
			}
		}, 100);

		// page leave confirmation
		window.onbeforeunload = function (e) {
			e = e || window.event;

			// For IE and Firefox prior to version 4
			if (e) {
				e.returnValue = "Any string";
			}

			// For Safari
			return "Any string";
		};

		return () => {
			clearInterval(intervalBg);
			Window.onbeforeunload = null;
		};
	});

	return (
		<>
			<Head>
				<title>Create a new post | Dadangdut33 - Blog</title>
				<meta charSet='UTF-8' />
				<link rel='icon' href='/favicon.ico' />
				<meta name='viewport' content='width=1200' />
			</Head>
			<main className='d-flex flex-column min-vh-100'>
				<div className='m-auto'>
					<div className='dashboard wrapper'>
						<div className={theme === "light" ? "row bg-white dashboard inside border-light" : "row bg-dark dashboard inside border-dark"}>
							<div className='col-md-12'>
								<div className='row'>
									<div className='col-md-12' style={{ position: "relative" }}>
										<div className='d-flex justify-content-between' style={{ position: "absolute" }}>
											<a href='/admin/dashboard' className='btn btn-outline-primary'>
												<i className='fas fa-arrow-left'></i> Back to Dashboard
											</a>
										</div>
										<h1 className='text-center'>Create a new post</h1>
										<span style={{ position: "absolute", right: "5px", top: "0px" }}>
											<DarkModeToggle fixed={false} />
										</span>
									</div>
								</div>
								<div className='row'>
									<div className='col-md-12'>
										<form className='form-group create-edit' onSubmit={handleSubmit}>
											<div className='form-group'>
												<label htmlFor='title'>Title</label>
												<input type='text' className='form-control' id='title' name='title' value={title} onInput={(e) => setTitle(e.target.value)} required />
											</div>
											<div className='form-group'>
												<label htmlFor='thumbnail'>Thumbnail</label>
												<input
													type='text'
													className='form-control'
													id='thumbnail'
													name='thumbnail'
													value={thumbnail}
													onInput={(e) => setThumbnail(e.target.value)}
													required
												/>
											</div>
											<div className='form-group'>
												<label htmlFor='tags'>Tags (Input separated by ,)</label>
												<input
													type='text'
													data-tip={`Previously used tags: ` + props.tags.join(", ")}
													className='form-control'
													id='tags'
													name='tags'
													value={tags}
													onInput={(e) => setTags(e.target.value)}
													required
												/>
											</div>
											<div className='form-group'>
												<label htmlFor='description'>Description</label>
												<textarea
													className='form-control'
													id='description'
													name='description'
													value={description}
													onInput={(e) => setDescription(e.target.value)}
													minLength={10}
													required
												/>
											</div>
											<div className='form-group'>
												<label htmlFor='preview'>Content</label>
												<div className='d-flex'>
													<textarea
														className='form-control ms-1'
														id='content'
														name='content'
														value={content}
														onInput={(e) => setContent(e.target.value)}
														style={{ width: "700px" }}
														minLength={50}
														required
													/>
													<span style={{ width: "700px", position: "relative" }}>
														<p style={{ position: "absolute", top: "-21px", left: "10px" }}>Preview</p>
														<Markdown text={content} theme={theme} onCopy={notify} />
													</span>
												</div>
											</div>
											<div className='form-group'>
												<button
													type='button'
													className='float-right btn btn-outline-secondary mt-2'
													onClick={() => {
														setPopupMsg("cancel and reset");
														setShowPopup(true);
													}}
												>
													Cancel
												</button>
												<button
													type='submit'
													className='float-right btn btn-info mt-2 me-2'
													onClick={(e) => {
														handleSubmit(e);
														setPopupMsg("save as draft");
														setShowPopup(true);
													}}
												>
													Save as Draft
												</button>
												<button
													type='submit'
													className='float-right btn btn-primary mt-2 me-2'
													onClick={(e) => {
														handleSubmit(e);
														setPopupMsg("upload");
														setShowPopup(true);
													}}
												>
													Submit & Upload
												</button>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			{showPopup ? (
				<div className='delete-popup'>
					<div className={theme === "light" ? "popup-content bg-light" : `popup-content bg-dark`}>
						<h1>Are you sure you want to {popupMsg} the post?</h1>
						<p>Warning! Action done is irreversible</p>
						<div className='btn-group'>
							<button
								className='btn btn-sm btn-outline-danger'
								onClick={() => {
									if (popupMsg === "upload") {
										// upload
										uploadPost();
									} else if (popupMsg === "save as draft") {
										// save as draft
										saveDraft();
									} else if (popupMsg === "cancel and reset") {
										resetForm();
										setShowPopup(false);
										notify("Post reseted");
									}
								}}
							>
								<small>????</small> Yes
							</button>
							<button
								className='btn btn-sm btn-outline-primary'
								onClick={() => {
									setShowPopup(false);
								}}
							>
								<small>????</small> No
							</button>
						</div>
					</div>
				</div>
			) : null}

			<ReactTooltip backgroundColor='#464692' />
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

export async function getServerSideProps(ctx) {
	const cookie = useCookie(ctx);
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;
	if (!admin) {
		ctx.res.writeHead(302, {
			Location: "/",
		});
		ctx.res.end();
	}

	const req = await fetch(`${serverUrl}/api/v1/post/get/tags`, {});
	let tags = await req.json();
	tags = tags
		.map((tag) => {
			return tag._id;
		})
		.sort((a, b) => {
			if (a < b) return -1;
		});

	return {
		props: {
			tags: tags,
		},
	};
}
