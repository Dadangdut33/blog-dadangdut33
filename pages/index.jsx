import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCookie } from "next-cookie";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import { serverUrl } from "../lib/server_url";
import load_bootstrapjs from "../lib/load_bootstrapjs";
import Meta from "../components/global/Meta";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";

export default function Home(props) {
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

	const sortPost = (posts, sortBy, showOnlyLiked) => {
		let postsSorted;
		switch (sortBy) {
			case "Newest":
				postsSorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
				break;
			case "Oldest":
				postsSorted = posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
				break;
			case "Views":
				postsSorted = posts.sort((a, b) => b.views - a.views);
				break;
			case "Likes":
				postsSorted = posts.sort((a, b) => b.upvote - a.upvote);
				break;
			default:
				postsSorted = posts;
				break;
		}

		if (showOnlyLiked) postsSorted = postsSorted.filter((post) => props.likedPost.includes(post.id));

		return postsSorted;
	};

	const parseDate = (date) => {
		const dateObj = new Date(date);
		// format day month in words year
		return `${dateObj.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})}`;
	};

	const scrollX = (ev, el, cardWidth, tagsWidth) => {
		if (tagsWidth > cardWidth - 75) {
			ev.preventDefault();
			el.scrollBy({
				top: 0,
				left: ev.deltaY,
				behavior: "smooth",
			});
		}
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

	const [sortBy, setSortBy] = useState("Newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);
	const posts = sortPost(filterPost(props.posts, searchQuery), sortBy, showOnlyLiked);
	const [theme, setTheme] = useState("bg-light border-card-dark");
	const [showMsg, setShowMsg] = useState(true);

	useEffect(() => {
		// load the cdn script after the page is loaded
		load_bootstrapjs(document);
		let postEmpty = false;
		try {
			// added to try catch in case post is empty
			const tagsCard = document.querySelectorAll("#tag-card");
			const insideCard = document.querySelector("#inside-card");
			let insideCardWidth = insideCard.offsetWidth;

			// on window resize update the width of the inside card
			window.addEventListener("resize", () => {
				insideCardWidth = insideCard.offsetWidth;
			});

			tagsCard.forEach((tag) => {
				tag.addEventListener("wheel", (e) => scrollX(e, tag, insideCardWidth, tag.offsetWidth));
			});
		} catch (e) {
			postEmpty = true;
		}

		let intervalBg = setInterval(() => {
			if (document.body.classList.contains("bg-dark")) {
				setTheme("bg-dark border-light");
			} else {
				setTheme("bg-light border-card-dark");
			}
		}, 100);

		return () => {
			// cleanup
			clearInterval(intervalBg);
			if (!postEmpty) {
				tagsCard.forEach((tag) => {
					tag.removeEventListener("wheel", (e) => scrollX(e, tag, insideCardWidth, tag.offsetWidth));
				});
			}
		};
	}, []);

	const fadeFromTop = {
		hidden: {
			opacity: 0,
			y: -100,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 70,
			},
		},
	};

	const fadeFromBottom = {
		hidden: {
			opacity: 0,
			y: 100,
		},
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				delay: 0.46,
				type: "spring",
				stiffness: 70,
			},
		},
	};

	return (
		<>
			<Meta
				title='Dadangdut33 - Blog'
				description='I share thoughts, ideas, and experiences that might be useful in your coding adventure'
				keywords='blog, tech, articles, tips'
				author='Dadangdut33'
				image={serverUrl + "/logo512.png"}
				url={serverUrl}
				siteName='Dadangdut33 - Blog'
				type='website'
				date={null}
			/>
			<main className='d-flex flex-column min-vh-100'>
				<Navbar admin={props.admin} />
				<div className='container'>
					<motion.div variants={fadeFromTop} initial='hidden' animate='visible'>
						<h1 style={{ marginTop: "1rem" }}>
							Blog <span style={{ fontSize: "1.25rem" }}>📝</span>
						</h1>
						<h5>I share thoughts, ideas, and experiences that might be useful in your coding adventure</h5>
						<span className='navbar-text'>
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
								<div>
									Sort by:{" "}
									<select onChange={(e) => setSortBy(e.target.value)} style={{ marginRight: "8px" }}>
										<option value='Newest'>Newest - Oldest</option>
										<option value='Oldest'>Oldest - Newest</option>
										<option value='Views'>Most Views</option>
										<option value='Likes'>Most Likes</option>
									</select>{" "}
								</div>
								<div>
									<span style={{ paddingRight: "4px" }}>Only show liked post</span>
									<input
										style={{ top: "6px", position: "absolute" }}
										type='checkbox'
										onChange={(e) => {
											setShowOnlyLiked(e.target.checked);
										}}
									/>
								</div>
							</div>

							{props.message && showMsg ? (
								<>
									<div
										className={props.message.status === "success" ? "alert alert-success mt-1" : "alert alert-danger mt-1"}
										role='alert'
										style={{ position: "relative", marginBottom: "0" }}
									>
										{props.message.message}
										<button
											type='button'
											className='close'
											data-dismiss='alert'
											aria-label='Close'
											style={{ position: "absolute", right: "10px" }}
											onClick={() => setShowMsg(!showMsg)}
										>
											<span aria-hidden='true'>❌</span>
										</button>
									</div>
								</>
							) : null}
						</span>
					</motion.div>

					<motion.div className='row card-container' variants={fadeFromBottom} initial='hidden' animate='visible'>
						{posts.length > 0
							? posts.map((post) => (
									<div className={`card card-lists border ${theme} shadow link-nodecor`} id='card' key={post.id} style={{ padding: 0 }}>
										<div className={`${theme.split(" ")[0]}`} id='inside-card'>
											<div className={`${theme.split(" ")[0]} thumbnail-wrapper`}>
												<a className='link-nodecor' href={`/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}>
													<Image className='card-img-top card-thumbnail' src={post.thumbnail} alt={post.title + " thumbnail"} width={1000} height={500} />
												</a>
											</div>
										</div>
										<div className={`card-body ${theme.split(" ")[0]}`}>
											<a className='link-nodecor' href={`/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}>
												<div>
													<h5 className='card-title' style={{ marginBottom: 0 }}>
														{post.title}
													</h5>
													<small className='text-muted card-small-el'>{parseDate(post.createdAt)}</small> <br />
													<small className='text-muted card-small-el'>
														<i className='far fa-eye icon-small'></i> {post.views} <i className='far fa-heart icon-small'></i> {post.upvote}
													</small>
													<p className='card-text card-desc text-dark'>{post.description}</p>
												</div>
											</a>
											<div className='d-flex justify-content-between align-items-center card-tags-container' id='tag-card'>
												<div className='btn-group'>
													{post.tag.map((tag, i) => {
														return (
															<span
																className='btn btn-sm btn-outline-secondary card-tags'
																style={{ cursor: "pointer" }}
																key={i}
																onClick={() => {
																	setActive(`search-${tag}`);
																	setSearchQuery(
																		searchQuery.includes(`[${tag}]`) ? searchQuery.replace(`[${tag}]`, "") : `[${tag}]` + searchQuery.replace(`[${tag}]`, "")
																	);
																}}
															>
																#{tag}
															</span>
														);
													})}
												</div>
											</div>
										</div>
									</div>
							  ))
							: `No post found`}
					</motion.div>
				</div>
				<Footer />
			</main>
		</>
	);
}

export async function getServerSideProps(ctx) {
	const res_Posts = await fetch(`${serverUrl}/api/v1/post/get/all`, {});
	const data_Posts = await res_Posts.json();

	// get all tags from data_posts
	let tags = [];
	if (data_Posts.length > 0) {
		tags = data_Posts.map((post) => post.tag.map((tag) => tag));
		tags = [].concat(...tags); // get all tags from the array tags
		tags = [...new Set(tags)].sort(); // remove duplicate tags and sort
	}

	const cookie = useCookie(ctx);
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;

	const likedPost = cookie.get("upvotedPosts") ? cookie.get("upvotedPosts") : [];

	const msgGet = cookie.get("message") ? cookie.get("message") : "";
	cookie.remove("message");

	return {
		props: {
			posts: data_Posts,
			tags: tags,
			message: msgGet,
			admin: admin,
			likedPost: likedPost,
		},
	};
}
