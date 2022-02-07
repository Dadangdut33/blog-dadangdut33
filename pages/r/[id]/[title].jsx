import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookie } from "next-cookie";
import { randomBytes } from "crypto";
import { serverUrl } from "../../../lib/server_url";
import load_bootstrapjs from "../../../lib/load_bootstrapjs";
import Meta from "../../../components/Meta";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ToastContainer, toast } from "react-toastify";
import CopyButton from "../../../components/CopyButton";
import ReactTooltip from "react-tooltip";

export default function postIdWithTitle({ post }) {
	const [theme, setTheme] = useState("light");
	const [liked, setLiked] = useState(false);

	const notify = (message) => {
		toast.success(message);
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

	const scrollCheck = (window, statsFloat, titleEl, markdownBody) => {
		if (window.scrollY > titleEl.offsetHeight && window.scrollY < markdownBody.offsetHeight + titleEl.offsetHeight) {
			statsFloat.classList.add("show");
		} else {
			statsFloat.classList.remove("show");
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

		const statsFloat = document.getElementById("post-stats-float");
		const titleEl = document.querySelector(".title");
		const markdownBody = document.querySelector(".markdownBody");
		window.addEventListener("scroll", () => scrollCheck(window, statsFloat, titleEl, markdownBody));

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

		return () => {
			clearInterval(intervalBg);
			window.removeEventListener("scroll", () => scrollCheck(window, statsFloat, titleEl, markdownBody));
		};
	}, []);

	const variants = {
		open: { opacity: 1, x: 0 },
		closed: { opacity: 0, x: "-100%" },
	};

	return (
		<main className='d-flex flex-column min-vh-100'>
			<Navbar />
			<div className='m-auto d-flex flex-column post-content' style={{ paddingTop: "6rem" }}>
				<div className='title'>
					<Image src={post.thumbnail} alt={post.title + "thumbnail"} width={1000} height={500} />
					<h1 id={post.title.replace(/\s+/g, "-")}>{post.title}</h1>
					<div className='post-stats'>
						{/* posted at */}
						<p className='text-muted first'>
							<small>
								<i className='fas fa-calendar-alt fa-xs'></i> {formatDate(post.createdAt)}
								<i className='fas fa-eye fa-xs icon-spacer'></i> {post.views}
								<i className='fas fa-heart fa-xs icon-spacer'></i> {post.upvote}
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

					<div className='wrap-stats'>
						<div className='stats' id='post-stats-float'>
							<div className='stats-item'>
								<i className='fas fa-heart fa-xs icon-spacer' data-tip='Like post'></i> Like -- liked
							</div>
							<CopyToClipboard text={post.title}>
								<div className='stats-item'>
									<i className='fas fa-link fa-xs icon-spacer'></i> Copy Link
								</div>
							</CopyToClipboard>
						</div>
					</div>
				</span>
			</div>
			<ReactTooltip />
			<ToastContainer position='bottom-center' autoClose={2250} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme={theme} />
			<Footer />
		</main>
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
		},
	};
}
