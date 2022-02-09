import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookie } from "next-cookie";
import ReactTooltip from "react-tooltip";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import { RedditShareButton, TwitterShareButton, FacebookShareButton } from "react-share";
import Meta from "../../../components/global/Meta";
import Navbar from "../../../components/global/Navbar";
import Footer from "../../../components/global/Footer";
import CopyButton from "../../../components/markdown/CopyButton";
import Comment from "../../../components/comment";
import { csrfToken } from "../../../lib/csrf";
import { serverUrl } from "../../../lib/server_url";
import load_bootstrapjs from "../../../lib/load_bootstrapjs";

export default function postIdWithTitle({ post, cookie, csrfToken }) {
	const [theme, setTheme] = useState("light");
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(post.upvote);
	const [showSide, setShowSide] = useState(false);
	const [progress, setProgress] = useState(0);
	const cookies = useCookie(cookie);

	const notify = (message) => {
		toast.success(message);
	};

	const likeCallback = async () => {
		const id = toast.loading("Loading...");
		const req = await fetch("/api/v1/post/action/upvote", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"xsrf-token": csrfToken,
			},
			body: JSON.stringify({
				id: post.id,
			}),
		});

		const res = await req.json();
		if (res.message === "Upvoted") {
			setLikes(likes + 1);
			setLiked(true);
			toast.update(id, { render: "Liked", type: "success", isLoading: false, autoClose: 1500 });
		} else if (res.message === "Upvote removed") {
			setLikes(likes - 1);
			setLiked(false);
			toast.update(id, { render: "Like removed", type: "info", isLoading: false, autoClose: 1500 });
		} else {
			toast.update(id, { render: res.message, type: "error", isLoading: false, autoClose: 1500 });
		}
	};

	const formatDate = (date) => {
		const dateObj = new Date(date);
		// format day month in words year
		return `${dateObj.toLocaleDateString("en-US", {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})}`;
	};

	const scrollCheck = (window, titleEl, markdownBody) => {
		if (window.scrollY > titleEl.offsetHeight && window.scrollY < markdownBody.offsetHeight + titleEl.offsetHeight - 250) {
			setShowSide(true);
			const height = markdownBody.offsetHeight - 500;
			const scroll = window.scrollY - titleEl.offsetHeight;
			const scrolled = (scroll / height) * 100;
			setProgress(scrolled);
		} else {
			setShowSide(false);
		}
	};

	useEffect(() => {
		load_bootstrapjs(document);

		let intervalBg = setInterval(() => {
			if (document.body.classList.contains("bg-dark")) {
				setTheme("dark");
			} else {
				setTheme("light");
			}
		}, 100);

		const titleEl = document.querySelector(".title");
		const markdownBody = document.querySelector(".markdownBody");
		window.addEventListener("scroll", () => scrollCheck(window, titleEl, markdownBody));

		// Get all heading elements and add id to them if they don't have one and add a href to their own id to make them clickable
		const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
		headings.forEach((heading) => {
			if (!heading.id) {
				heading.id = heading.innerHTML.replace(/\s/g, "-");
				heading.innerHTML = `<span class="anchor-link bot-light"><a href="#${heading.id}" class="subtle-link heading">${heading.innerHTML}</a></span>`;
			}
		});

		// get p and li
		const p_li = document.querySelectorAll("p, li");
		p_li.forEach((p_li) => {
			p_li.classList.add("text-dark");
		});

		// check like
		setLiked(cookies.get("upvotedPosts") ? cookies.get("upvotedPosts").includes(post.id) : false);

		return () => {
			clearInterval(intervalBg);
			window.removeEventListener("scroll", () => scrollCheck(window, titleEl, markdownBody));
		};
	}, []);

	const side_Variants = {
		open: { opacity: 1, y: 0 },
		closed: { opacity: 0, y: "-100%" },
	};

	return (
		<>
			<Meta
				title={post.title + " | Dadangdut33 - Blog"}
				description={post.description}
				keywords={post.tag.map((tag) => tag.replace(/\s+/g, ""))}
				author='Dadangdut33'
				image={post.thumbnail}
				url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
				siteName='Dadangdut33 - Blog'
				type='article'
				date={post.createdAt}
			/>
			<main className='d-flex flex-column min-vh-100'>
				<Navbar />
				<div className='m-auto d-flex flex-column post-content' style={{ paddingTop: "6rem" }}>
					<a href='/' className='btn btn-outline-dark btn-sm mr-2' data-tip='Click here to go back to homepage' data-place='bottom'>
						<i className='fas fa-home'></i>
					</a>
					<div className='title'>
						<Image src={post.thumbnail} alt={post.title + "thumbnail"} width={1000} height={500} />
						<h1 id={post.title.replace(/\s+/g, "-")}>{post.title}</h1>
						<div className='post-stats'>
							<p className='text-muted first'>
								<small>
									<i className='fas fa-calendar-alt fa-xs'></i> {formatDate(post.createdAt)}
									<i className='fas fa-eye fa-xs icon-spacer'></i> {post.views}
									<i className='fas fa-heart fa-xs icon-spacer'></i> {likes}
								</small>
							</p>
						</div>
					</div>

					<span className='md-wrapper'>
						<ReactMarkdown
							className='markdownBody'
							children={post.content}
							remarkPlugins={[gfm]}
							components={{
								code({ node, inline, className, children, ...props }) {
									const match = /language-(\w+)/.exec(className || "");
									return !inline && match ? (
										<div className='codeblock-wrapper'>
											<CopyButton text={String(children).replace(/\n$/, "")} onCopy={notify} />
											<div className='lang-name'>
												<button className='btn btn-outline-info btn-lang shadow-none'>{match[1]}</button>
											</div>
											<div style={{ paddingTop: "20px" }}>
												<SyntaxHighlighter children={String(children).replace(/\n$/, "")} style={synthwave84} language={match[1]} {...props} />
											</div>
										</div>
									) : (
										<>
											<code className={theme === "dark" ? "text-light" : "text-dark"}>{children}</code>
										</>
									);
								},
							}}
						/>

						<div className='wrap-progress'>
							<div className='wrapper'>
								<motion.span className='progress-bar' animate={showSide ? "open" : "closed"} variants={side_Variants}>
									<span className='progress' id='progress' style={{ height: `${progress}%` }}></span>
								</motion.span>
							</div>
						</div>

						<div className='wrap-stats'>
							<motion.div className='stats' id='post-stats-float' animate={showSide ? "open" : "closed"} variants={side_Variants}>
								<div className='stats-item hover-effect pointer-cursor'>
									<span className='icon-spacer-margin ripple' onClick={() => likeCallback()} data-tip={liked ? "Unlike the post" : "Like the post"} data-place='right'>
										{liked ? <i className='fas fa-heart fa-xs'></i> : <i className='far fa-heart fa-xs'></i>} {liked ? "Liked" : "Like"}
									</span>
								</div>
								<CopyToClipboard
									text={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									onCopy={() => notify("Post url copied to clipboard")}
									data-tip='Copy post url to clipboard'
									data-place='right'
								>
									<div className='stats-item hover-effect pointer-cursor'>
										<span className='icon-spacer-margin'>
											<i className='fas fa-link fa-xs'></i> Copy Link
										</span>
									</div>
								</CopyToClipboard>
								<div className='stats-item'>
									<RedditShareButton
										url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
										title={post.title}
										className='hover-effect'
										data-tip='Share the post to reddit'
										data-place='bottom'
									>
										<span className='icon-spacer-margin inline pointer-cursor'>
											<i className='fab fa-reddit fa-xs'></i>
										</span>
									</RedditShareButton>
									<TwitterShareButton
										url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
										title={post.title}
										hashtags={post.tag.map((tag) => tag.replace(/\s+/g, ""))}
										className='hover-effect'
										data-tip='Share the post to twitter'
										data-place='bottom'
									>
										<span className='icon-spacer-margin inline pointer-cursor'>
											<i className='fab fa-twitter fa-xs'></i>
										</span>
									</TwitterShareButton>
									<FacebookShareButton
										url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
										quote={post.description}
										className='hover-effect'
										data-tip='Share the post to facebook'
										data-place='bottom'
									>
										<span className='icon-spacer-margin inline pointer-cursor'>
											<i className='fab fa-facebook-f fa-xs'></i>
										</span>
									</FacebookShareButton>
								</div>
							</motion.div>
						</div>

						<div>
							<div className='icon-spacer-margin post-tags markdownBody no-border no-pad'>
								{post.tag.map((tag, i) => (
									<span className='btn btn-sm btn-outline-secondary card-tags post-tag' style={{ cursor: "default" }} key={i}>
										#{tag}
									</span>
								))}
							</div>

							<div className='stats-item pt-2'>
								<span className='icon-spacer-margin ripple pointer-cursor' onClick={() => likeCallback()} data-tip={liked ? "Unlike the post" : "Like the post"} data-place='bottom'>
									{liked ? <i className='fas fa-heart fa-xs'></i> : <i className='far fa-heart fa-xs'></i>} {liked ? "Liked" : "Like"}
								</span>
								<CopyToClipboard
									text={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									onCopy={() => notify("Post url copied to clipboard")}
									data-tip='Copy post url to clipboard'
									data-place='bottom'
								>
									<span className='icon-spacer-margin pointer-cursor'>
										<i className='fas fa-link fa-xs'></i> Copy Link
									</span>
								</CopyToClipboard>
								<RedditShareButton
									url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									title={post.title}
									className='hover-effect'
									data-tip='Share the post to reddit'
									data-place='bottom'
								>
									<span className='icon-spacer-margin inline pointer-cursor'>
										<i className='fab fa-reddit fa-xs'></i>
									</span>
								</RedditShareButton>
								<TwitterShareButton
									url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									title={post.title}
									hashtags={post.tag.map((tag) => tag.replace(/\s+/g, ""))}
									className='hover-effect'
									data-tip='Share the post to twitter'
									data-place='bottom'
								>
									<span className='icon-spacer-margin inline pointer-cursor'>
										<i className='fab fa-twitter fa-xs'></i>
									</span>
								</TwitterShareButton>
								<FacebookShareButton
									url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									quote={post.description}
									className='hover-effect'
									data-tip='Share the post to facebook'
									data-place='bottom'
								>
									<span className='icon-spacer-margin inline pointer-cursor'>
										<i className='fab fa-facebook-f fa-xs'></i>
									</span>
								</FacebookShareButton>
							</div>
						</div>

						<div className='markdownBody no-border no-pad'>
							<hr className='comment-divider' />
							<Comment theme={theme} />
						</div>
					</span>
				</div>

				<ReactTooltip effect='solid' backgroundColor='#464692' />
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
					theme={theme}
				/>
				<Footer />
			</main>
		</>
	);
}

export async function getServerSideProps(context) {
	const { id } = context.query;

	// get data from db based on id ... (later)
	const getPost = await fetch(`${serverUrl}/api/v1/post/get/${id}`);

	if (getPost.status === 404) {
		return {
			notFound: true,
		};
	}

	const post = await getPost.json();

	// return post data
	return {
		props: {
			post: post[0],
			cookie: context.req.headers.cookie || "",
			csrfToken: csrfToken,
		},
	};
}
