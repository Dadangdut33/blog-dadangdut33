import Head from "next/head";
import Image from "next/image";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import load_bootstrapjs from "../lib/load_bootstrapjs";
import { generateRSSFeed } from "../lib/rss";
import { motion } from "framer-motion";

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [searchClick, setSearchClick] = useState(false);

	useEffect(() => {
		// load the cdn script after the page is loaded
		load_bootstrapjs(document);
	}, []);

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
		setPosts(filteredPosts);
	};

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
				<h5>Thoughts, ideas, and experiences that might help your coding adventure</h5>
				<span className='navbar-text'>
					<input className='form-control me-2 bg-light text-dark' id='search' type='search' placeholder='Search post 🔎' aria-label='Search' />
				</span>
				<div className='row card-container'>
					{posts.map((post) => (
						<motion.a
							className='card card-lists bg-light border border-card-dark shadow link-nodecor'
							href={`/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
							id='card'
							key={post.id}
							style={{ padding: 0 }}
							whileHover={{ scale: 1.01 }}
						>
							<Image className='card-img-top card-thumbnail' src={post.thumbnail} alt={post.title + " thumbnail"} width={390} height={200} />
							<div className='card-body bg-light'>
								<h5 className='card-title' style={{ marginBottom: 0 }}>
									{post.title}
								</h5>
								<small className='text-muted'>{parseDate(post.createdAt)}</small> <br />
								<small className='text-muted'>
									<i className='far fa-eye icon-small'></i> {post.views} <i className='bi bi-arrow-up icon-small'></i> {post.upvote} <i className='bi bi-arrow-down icon-small'></i> {post.downvote}
								</small>
								<p className='card-text card-desc'>{post.description}</p>
								<div className='d-flex justify-content-between align-items-center card-tags-container'>
									<div className='btn-group'>
										{post.tag.map(
											(tag) => {
												return (
													<a className='btn btn-sm btn-outline-secondary card-tags' href={`/tag/${encodeURIComponent(tag.replace(/\s+/g, "-"))}`}>
														#{tag}
													</a>
												);
											} // map the tags
										)}
									</div>
								</div>
							</div>
						</motion.a>
					))}
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
