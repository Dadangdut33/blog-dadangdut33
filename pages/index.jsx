import Head from "next/head";
import Image from "next/image";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import load_bootstrapjs from "../lib/load_bootstrapjs";
import { generateRSSFeed } from "../lib/rss";
export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [originalPosts, setOriginalPosts] = useState(props.posts);
	const [searching, setSearching] = useState(false);

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

	const filterByTag = (tag) => {
		const filteredPosts = posts.filter((post) => post.tag.includes(tag));
		setSearching(true);
		setPosts(filteredPosts);
	};

	useEffect(() => {
		// load the cdn script after the page is loaded
		load_bootstrapjs(document);
		const tags = document.querySelectorAll("#tag-groups");
		tags.forEach((tag) => {
			tag.addEventListener("wheel", (e) => {
				e.preventDefault();
				tag.scrollBy({
					top: 0,
					left: e.deltaY,
					behavior: "smooth",
				});
			});
		});

		return () => {
			// cleanup
			tags.forEach((tag) => {
				tag.removeEventListener("wheel", (e) => {
					e.preventDefault();
					tag.scrollBy({
						top: 0,
						left: e.deltaY,
						behavior: "smooth",
					});
				});
			});
		};
	}, []);

	return (
		<>
			<Head>
				<title>Dadangdut33 - Blog</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<NavBar />
			<div className='container'>
				<h1 style={{ marginTop: "1rem" }}>
					Blog <span style={{ fontSize: "1.25rem" }}>📝</span>
				</h1>
				<h5>I share thoughts, ideas, and experiences that might be useful in your coding adventure</h5>
				<span className='navbar-text'>
					<input className='form-control me-2 bg-light text-dark' id='search' type='search' placeholder='Search post 🔎' aria-label='Search' />
				</span>
				<div className='row card-container'>
					{posts.length > 0
						? posts.map((post) => (
								<div className='card card-lists bg-light border border-card-dark shadow link-nodecor' id='card' key={post.id} style={{ padding: 0 }}>
									<div className='bg-light'>
										<div className='bg-light thumbnail-wrapper'>
											<a className='link-nodecor' href={`/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}>
												<Image className='card-img-top card-thumbnail' src={post.thumbnail} alt={post.title + " thumbnail"} width={1000} height={500} />
											</a>
										</div>
									</div>
									<div className='card-body bg-light'>
										<a className='link-nodecor' href={`/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}>
											<div>
												<h5 className='card-title' style={{ marginBottom: 0 }}>
													{post.title}
												</h5>
												<small className='text-muted card-font-persist'>{parseDate(post.createdAt)}</small> <br />
												<small className='text-muted card-font-persist'>
													<i className='far fa-eye icon-small'></i> {post.views} <i className='bi bi-arrow-up icon-small'></i> {post.upvote} <i className='bi bi-arrow-down icon-small'></i>{" "}
													{post.downvote}
												</small>
												<p className='card-text card-desc card-font-persist'>{post.description}</p>
											</div>
										</a>
										<div className='d-flex justify-content-between align-items-center card-tags-container' id='tag-groups'>
											<div className='btn-group'>
												{post.tag.map(
													(tag) => {
														return (
															<a className='btn btn-sm btn-outline-secondary card-tags card-font-persist' style={{ cursor: "pointer" }} onClick={() => filterByTag(tag)}>
																#{tag}
															</a>
														);
													} // map the tags
												)}
											</div>
										</div>
									</div>
								</div>
						  ))
						: searching
						? `No post found`
						: `No post yet`}
				</div>
			</div>
		</>
	);
}

export async function getStaticProps() {
	const response = await fetch("http://localhost:3000/api/v1/post/get/all", {});
	const data = await response.json();

	generateRSSFeed(data);

	return {
		props: { posts: data },
	};
}
