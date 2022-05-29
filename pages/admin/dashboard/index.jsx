import { ToastContainer, toast } from "react-toastify";
import Head from "next/head";
import { useCookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import { useEffect, useState } from "react";
import ReactTooltip from "react-tooltip";
import { serverUrl } from "../../../lib/server_url";

export default function Dashboard(props) {
	const sortPost = (posts, sortBy) => {
		switch (sortBy) {
			case "Newest":
				return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			case "Oldest":
				return posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			case "Views":
				return posts.sort((a, b) => b.views - a.views);
			case "Likes":
				return posts.sort((a, b) => b.upvote - a.upvote);

			default:
				break;
		}
	};

	const filterPost = (posts, query) => {
		if (!query) {
			return posts;
		}

		// check if query contains [tag]
		const regexp = /\[(.*?)\]/g;
		const tag = [...query.matchAll(regexp)];
		// get the string matched by the tag
		const tagName = tag.map((item) => item[1]);

		if (tagName.length > 0) {
			const filterOne = posts.filter((post) => post.tag.some((tag) => tagName.includes(tag))); // get all post that match given tag
			query = query.replace(/\[(.*?)\]/g, ""); // remove tag from query

			return filterOne.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()) || post.description.toLowerCase().includes(query.toLowerCase()));
		} else {
			return posts.filter((post) => post.title.toLowerCase().includes(query.toLowerCase()) || post.description.toLowerCase().includes(query.toLowerCase()));
		}
	};

	const filterDelete = (posts, deleted, type) => {
		// remove post that has been deleted by id
		if (type === "post") {
			return posts.filter((post) => !deleted.includes(post.id));
		} else if (type === "draft") {
			return posts.filter((post) => !deleted.includes(post._id));
		}
	};

	// posts
	const [sortBy, setSortBy] = useState("Newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [deletedPost, setDeletedPost] = useState([]);
	const posts = filterDelete(sortPost(filterPost(props.posts, searchQuery), sortBy), deletedPost, "post");

	// drafts
	const [deletedDraft, setDeletedDraft] = useState([]);
	const drafts = filterDelete(props.drafts, deletedDraft, "draft");

	// to delete
	const [deletePopup, setDeletePopup] = useState(false);
	const [deletePostData, setDeletePostData] = useState(null);

	const parseDate = (date) => {
		const dateObj = new Date(date);
		// format detailed
		const month = dateObj.getMonth() + 1;
		const day = dateObj.getDate();
		const year = dateObj.getFullYear();
		const hours = dateObj.getHours() < 10 ? `0${dateObj.getHours()}` : dateObj.getHours();
		const minutes = dateObj.getMinutes() < 10 ? `0${dateObj.getMinutes()}` : dateObj.getMinutes();
		const seconds = dateObj.getSeconds() < 10 ? `0${dateObj.getSeconds()}` : dateObj.getSeconds();

		return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
	};

	const setActive = (elId) => {
		const el = document.getElementById(elId);
		if (el.classList.contains("active")) {
			el.classList.remove("active");
		} else {
			el.classList.add("active");
		}
	};

	const checkTag = (query) => {
		if (!query) {
			const searchTags = document.querySelectorAll(".search-card");
			searchTags.forEach((tag) => {
				tag.classList.remove("active");
			});
		}

		// check if query contains [tag]
		const regexp = /\[(.*?)\]/g;
		const tag = [...query.matchAll(regexp)];
		// get the string matched by the tag
		const tagName = tag.map((item) => item[1]);

		const searchTags = document.querySelectorAll(".search-card");
		searchTags.forEach((tag) => {
			if (tagName.includes(tag.id.split("-").pop())) {
				tag.classList.add("active");
			} else {
				tag.classList.remove("active");
			}
		});
	};

	const deletePost = async (data) => {
		const toastId = toast.loading("Deleting...");

		if (!data) {
			toast.update(toastId, {
				render: "Error No ID Given",
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 2000,
			});
			return;
		}

		let bodyData = {};
		if (data.type === "draft") {
			bodyData = {
				_id: data.id,
			};
		} else {
			bodyData = {
				id: data.id,
			};
		}

		const req = await fetch(`${serverUrl}/api/v1/${data.type}/action/delete`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(bodyData),
		});

		const res = await req.json();

		if (req.status === 200) {
			toast.update(toastId, {
				render: "Post deleted successfully",
				type: toast.TYPE.SUCCESS,
				isLoading: false,
				autoClose: 2000,
			});
			if (data.type === "post") setDeletedPost([...deletedPost, data.id]);
			else setDeletedDraft([...deletedDraft, data.id]);

			setDeletePopup(false);
			setDeletePostData(null);
		} else {
			toast.update(toastId, {
				render: `Error ${res.message}`,
				type: toast.TYPE.ERROR,
				isLoading: false,
				autoClose: 2000,
			});
		}
	};

	useEffect(() => {
		document.body.classList.add("admin-dashboard");
	});

	return (
		<>
			<Head>
				<title>Admin Dashboard | Dadangdut33 Blog</title>
				<meta charSet='UTF-8' />
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<main className='d-flex flex-column min-vh-100'>
				<div className='m-auto'>
					<div className='dashboard wrapper'>
						<div className='row bg-white dashboard inside border-light' style={{ fontSize: "large" }}>
							<div className='col-md-12'>
								<h1>
									Admin 🛠
									<span className='float-right'>
										<a href='/admin/logout' className='btn btn-danger'>
											🚩 Logout
										</a>
										<a href='/' className='btn btn-primary ms-1'>
											🏠 Homepage
										</a>
										<a href='/admin/dashboard/post/create' className='btn btn-success ms-1'>
											➕ Create New Post
										</a>
									</span>
								</h1>
								<h2>Post</h2>
								<input
									value={searchQuery}
									onInput={(e) => {
										checkTag(e.target.value);
										setSearchQuery(e.target.value);
									}}
									className='form-control me-2 bg-light text-dark'
									id='search'
									type='search'
									placeholder='Search post 🔎'
									aria-label='Search'
								/>
								<div className='search-tags'>
									Tags:{" "}
									{props.tags.map((tag, i) => (
										<span
											id={`search-${tag}`}
											key={i}
											className='btn btn-sm btn-outline-secondary card-tags search-card'
											onClick={() => {
												setActive(`search-${tag}`);
												setSearchQuery(searchQuery.includes(`[${tag}]`) ? searchQuery.replace(`[${tag}]`, "") : `[${tag}]` + searchQuery.replace(`[${tag}]`, ""));
											}}
										>
											#{tag}
										</span>
									))}
								</div>

								<div className='sort-by pt-2'>
									Sort by:{" "}
									<select onChange={(e) => setSortBy(e.target.value)}>
										<option value='Newest'>Newest - Oldest</option>
										<option value='Oldest'>Oldest - Newest</option>
										<option value='Views'>Most Views</option>
										<option value='Likes'>Most Likes</option>
									</select>
								</div>

								<table className='table table-hover table-striped'>
									<thead>
										<tr>
											<th>#</th>
											<th scope='col'>Title</th>
											<th scope='col'>Description</th>
											<th scope='col'>Views</th>
											<th scope='col'>Likes</th>
											<th scope='col'>Date</th>
											<th scope='col'>Action</th>
										</tr>
									</thead>
									<tbody>
										{posts.length > 0 ? (
											posts.map((post, i) => (
												<tr key={i}>
													<th scope='row'>{i + 1}</th>
													<td style={{ maxWidth: "300px" }}>
														<a href={`/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}>{post.title}</a>
														<span data-tip={`ID: ${post.id} | Tags: ` + post.tag.join(", ")}> 🔗</span>
													</td>
													<td style={{ maxWidth: "600px" }}>{post.description}</td>
													<td style={{ maxWidth: "100px" }}>{post.views}</td>
													<td style={{ maxWidth: "100px" }}>{post.upvote}</td>
													<td style={{ maxWidth: "120px" }}>
														<span
															className='post-date'
															data-tip={`Last updated: ${post.lastUpdatedAt ? parseDate(post.lastUpdatedAt) : `No Changes`}`}
															data-place='bottom'
														>
															{parseDate(post.createdAt)}
														</span>
													</td>
													<td style={{ maxWidth: "200px" }}>
														<a href={`/admin/dashboard/post/edit/${post.id}`}>
															<a className='btn btn-sm btn-outline-primary'>Edit</a>
														</a>
														<button
															className='btn btn-sm btn-outline-danger dashboard action-table'
															onClick={() => {
																// 3 layer of confirmation just in case i'm a dumb idiot and delete something by accident
																if (window.confirm("Confirmation #1\nAre you sure that you want to delete this post?")) {
																	if (window.confirm("Confirmation #2\nAre you really really sure that you want to delete this post?")) {
																		setDeletePopup(true);
																		setDeletePostData({ id: post.id, type: "post" });
																	}
																}
															}}
														>
															Delete
														</button>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan='7'>
													<div className='text-center'>
														<h3>No posts found</h3>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>

								<h2>Draft</h2>

								<table className='table table-hover table-striped'>
									<thead>
										<tr>
											<th>#</th>
											<th scope='col'>Title</th>
											<th scope='col'>Description</th>
											<th scope='col'>Date</th>
											<th scope='col'>Action</th>
										</tr>
									</thead>
									<tbody>
										{drafts.length > 0 ? (
											drafts.map((draft, i) => (
												<tr key={i}>
													<th scope='row'>{i + 1}</th>
													<td style={{ maxWidth: "300px" }}>
														{draft.title}
														<span data-tip={`ID: ${draft._id} | Tags: ` + draft.tag.join(", ")}> 🔗</span>
													</td>
													<td style={{ maxWidth: "600px" }}>{draft.description}</td>
													<td style={{ maxWidth: "120px" }}>
														<span
															className='post-date'
															data-tip={`Last updated: ${draft.lastUpdatedAt ? parseDate(draft.lastUpdatedAt) : `No Changes`}`}
															data-place='bottom'
														>
															{parseDate(draft.createdAt)}
														</span>
													</td>
													<td style={{ maxWidth: "200px" }}>
														<a href={`/admin/dashboard/draft/edit/${draft._id}`}>
															<a className='btn btn-sm btn-outline-primary'>Edit</a>
														</a>
														<button
															className='btn btn-sm btn-outline-danger dashboard action-table'
															onClick={() => {
																// 3 layer of confirmation just in case i'm a dumb idiot and delete something by accident
																if (window.confirm("Confirmation #1\nAre you sure that you want to delete this post?")) {
																	if (window.confirm("Confirmation #2\nAre you really really sure that you want to delete this post?")) {
																		setDeletePopup(true);
																		setDeletePostData({ id: draft._id, type: "draft" });
																	}
																}
															}}
														>
															Delete
														</button>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan='5'>
													<div className='text-center'>
														<h3>No Drafts found</h3>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</table>
								{deletePopup ? (
									<div className='delete-popup'>
										<div className='popup-content'>
											<h1>OK! Are you sure you want to delete this post now?</h1>
											<p>Warning! This action cannot be undone!!</p>
											<div className='btn-group'>
												<button
													className='btn btn-sm btn-outline-danger'
													onClick={() => {
														deletePost(deletePostData);
													}}
												>
													<small>🔴</small> Delete
												</button>
												<button
													className='btn btn-sm btn-outline-primary'
													onClick={() => {
														setDeletePopup(false);
														setDeletePostData(null);
													}}
												>
													<small>🔵</small> Cancel
												</button>
											</div>
										</div>
									</div>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</main>

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

	const res_Posts = await fetch(`${serverUrl}/api/v1/post/get/all`, {});
	const data_Posts = await res_Posts.json();

	const res_Drafts = await fetch(`${serverUrl}/api/v1/draft/get/all`, {});
	const data_Drafts = await res_Drafts.json();

	// get all tags from data_posts
	let tags = data_Posts.map((post) => post.tag.map((tag) => tag));
	tags = [].concat(...tags); // get all tags from the array tags
	tags = [...new Set(tags)].sort(); // remove duplicate tags and sort

	return {
		props: {
			posts: data_Posts,
			drafts: data_Drafts,
			tags: tags,
		},
	};
}
