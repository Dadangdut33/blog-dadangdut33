import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookie } from "next-cookie";
import ReactTooltip from "react-tooltip";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import aes from "crypto-js/aes";
import { enc } from "crypto-js/core";
import { serverUrl } from "../../../lib/server_url";
import Meta from "../../../components/global/Meta";
import Navbar from "../../../components/global/Navbar";
import Footer from "../../../components/global/Footer";
import Comment from "../../../components/Comment";
import load_bootstrapjs from "../../../lib/load_bootstrapjs";
import Markdown from "../../../components/markdown/Markdown";
import Share from "../../../components/markdown/Share";

export default function postIdWithTitle({ post, cookie, admin }) {
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
			toast.update(id, { render: res.message + " Try to refresh the page!", type: "error", isLoading: false, autoClose: 1500 });
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

		// bg check
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

		// get all image inside markdownbody
		const images = document.querySelectorAll(".markdownBody img");

		images.forEach((image, i) => {
			image.setAttribute("data-bs-toggle", "modal");
			image.setAttribute("data-bs-target", `#modal-${i}`);

			const modal = document.createElement("div");
			modal.className = "modal fade";
			modal.id = `modal-${i}`;

			const modalDialog = document.createElement("div");
			modalDialog.className = "modal-dialog modal-fullscreen";
			modal.appendChild(modalDialog);

			const modalContent = document.createElement("div");
			modalContent.className = "modal-content";
			modalDialog.appendChild(modalContent);

			// header
			const modalHeader = document.createElement("div");
			modalHeader.className = "modal-header";
			modalContent.appendChild(modalHeader);

			const modalTitle = document.createElement("h5");
			modalTitle.className = "modal-title";
			modalTitle.innerHTML = image.alt;
			modalHeader.appendChild(modalTitle);

			const modalClose = document.createElement("button");
			modalClose.className = "btn-close";
			modalClose.style = "padding-right: 2rem;";
			modalClose.setAttribute("data-bs-dismiss", "modal");
			modalClose.ariaLabel = "Close";
			modalHeader.appendChild(modalClose);

			// body
			const modalBody = document.createElement("div");
			modalBody.className = "modal-body";
			modalContent.appendChild(modalBody);

			const imgWrapper = document.createElement("div");
			imgWrapper.className = "d-flex";
			modalBody.appendChild(imgWrapper);

			const modalImage = document.createElement("img");
			modalImage.className = "m-auto img-fluid";
			modalImage.src = image.src;
			modalImage.alt = image.alt;
			imgWrapper.appendChild(modalImage);

			// footer
			const modalFooter = document.createElement("div");
			modalFooter.className = "modal-footer";
			modalContent.appendChild(modalFooter);

			const modalClose2 = document.createElement("button");
			modalClose2.className = "btn btn-secondary";
			modalClose2.style = "margin-right: .5rem;";
			modalClose2.setAttribute("data-bs-dismiss", "modal");
			modalClose2.innerHTML = "Close";
			modalFooter.appendChild(modalClose2);

			const btnOpenNewTab = document.createElement("button");
			btnOpenNewTab.className = "btn btn-primary";
			btnOpenNewTab.style = "margin-right: .5rem;";
			btnOpenNewTab.innerHTML = "Open in new tab";
			btnOpenNewTab.onclick = () => {
				window.open(image.src, "_blank");
			};
			modalFooter.appendChild(btnOpenNewTab);

			document.body.appendChild(modal);
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

	const fadeIn = {
		initial: { opacity: 0, y: 100 },
		show: {
			opacity: 1,
			y: 0,
			transition: {
				type: "spring",
				stiffness: 77,
			},
		},
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
				<Navbar admin={admin} />
				<motion.div className='m-auto d-flex flex-column post-content' style={{ paddingTop: "6rem" }} initial={"initial"} animate={"show"} variants={fadeIn}>
					<a
						href='/'
						className={theme === "dark" ? `btn btn-outline-light btn-sm mr-2` : `btn btn-outline-dark btn-sm mr-2`}
						data-tip='Click here to go back to homepage'
						data-place='bottom'
					>
						<i className='fas fa-home'></i>
					</a>
					<div className='title'>
						<Image src={post.thumbnail} alt={post.title + "thumbnail"} width={1000} height={500} />
						<h1 id={post.title.replace(/\s+/g, "-")}>{post.title}</h1>
						<div className='post-stats'>
							<p className='text-muted first'>
								<small>
									<span className='post-date' data-tip={`Last updated: ${post.lastUpdatedAt ? formatDate(post.lastUpdatedAt) : `No Changes`}`} data-place='bottom'>
										<i className='fas fa-calendar-alt fa-xs'></i> {formatDate(post.createdAt)}
									</span>
									<i className='fas fa-eye fa-xs icon-spacer'></i> {post.views}
									<i className='fas fa-heart fa-xs icon-spacer'></i> {likes}
								</small>
							</p>
						</div>
					</div>

					<span className='md-wrapper'>
						<Markdown text={post.content} onCopy={notify} theme={theme} />

						<div className='wrap-progress'>
							<div className='wrapper'>
								<motion.span className='progress-bar' animate={showSide ? "open" : "closed"} variants={side_Variants}>
									<span className='progress' id='progress' style={{ height: `${progress}%` }}></span>
								</motion.span>
							</div>
						</div>

						<div className='wrap-stats'>
							<motion.div className='stats' id='post-stats-float' animate={showSide ? "open" : "closed"} variants={side_Variants}>
								<Share
									liked={liked}
									inline={false}
									url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									desc={post.description}
									title={post.title}
									tags={post.tag.map((tag) => tag.replace(/\s+/g, ""))}
									onCopy={notify}
									likeCallback={likeCallback}
									tipPlacement={["right", "right", "bottom", "bottom", "bottom"]}
								/>
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
								<Share
									liked={liked}
									inline={true}
									url={`${serverUrl}/r/${post.id}/${encodeURIComponent(post.title.replace(/\s+/g, "-"))}`}
									desc={post.description}
									title={post.title}
									tags={post.tag.map((tag) => tag.replace(/\s+/g, ""))}
									onCopy={notify}
									likeCallback={likeCallback}
								/>
							</div>
						</div>

						<div className='markdownBody no-border no-pad'>
							<hr className='comment-divider' />
							<Comment theme={theme} />
						</div>
					</span>
				</motion.div>

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

export async function getServerSideProps(ctx) {
	const { id } = ctx.query;

	// get data from db based on id ... (later)
	const getPost = await fetch(`${serverUrl}/api/v1/post/get/${id}`);

	if (getPost.status === 404) {
		return {
			notFound: true,
		};
	}

	const post = await getPost.json();

	const cookie = useCookie(ctx);
	let admin = cookie.get("user") ? JSON.parse(aes.decrypt(cookie.get("user"), process.env.SESSION_PASSWORD).toString(enc.Utf8)).admin : false;

	// return post data
	return {
		props: {
			post: post[0],
			cookie: ctx.req.headers.cookie || "",
			admin: admin,
		},
	};
}
