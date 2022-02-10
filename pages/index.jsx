import Image from "next/image";
import { useEffect, useState } from "react";
import { serverUrl } from "../lib/server_url";
import load_bootstrapjs from "../lib/load_bootstrapjs";
import Meta from "../components/global/Meta";
import Navbar from "../components/global/Navbar";
import Footer from "../components/global/Footer";
import { motion } from "framer-motion";

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

	const sortPost = (posts, sortBy) => {
		switch (sortBy) {
			case "Newest":
				return posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
			case "Oldest":
				console.log("Oldest");
				return posts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
			case "Views":
				return posts.sort((a, b) => b.views - a.views);
			case "Likes":
				return posts.sort((a, b) => b.upvote - a.upvote);

			default:
				break;
		}
	};

	const [sortBy, setSortBy] = useState("Newest");
	const [searchQuery, setSearchQuery] = useState("");
	const posts = sortPost(filterPost(props.posts, searchQuery), sortBy);
	const [theme, setTheme] = useState("bg-light border-card-dark");

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

	useEffect(() => {
		// load the cdn script after the page is loaded
		load_bootstrapjs(document);
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
			tagsCard.forEach((tag) => {
				tag.removeEventListener("wheel", (e) => scrollX(e, tag, insideCardWidth, tag.offsetWidth));
			});
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
				<Navbar />
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
								Sort by:{" "}
								<select onChange={(e) => setSortBy(e.target.value)}>
									<option value='Newest'>Newest - Oldest</option>
									<option value='Oldest'>Oldest - Newest</option>
									<option value='Views'>Most Views</option>
									<option value='Likes'>Most Likes</option>
								</select>
							</div>
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
							: searchQuery !== ""
							? `No post found`
							: `No post yet`}
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
	let tags = data_Posts.map((post) => post.tag.map((tag) => tag));
	// get all tags from the array tags
	tags = [].concat(...tags);
	// remove duplicate tags and sort
	tags = [...new Set(tags)].sort();

	return {
		props: { posts: data_Posts, tags: tags },
	};
}
