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

export default function postIdWithTitle(props) {
	const post = props.post[0];
	const [theme, setTheme] = useState("light");

	const notify = (message) => {
		toast.success(message);
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
		};
	}, []);

	return (
		<main className='d-flex flex-column min-vh-100'>
			<Navbar />
			<div className='m-auto d-flex flex-column post-content' style={{ paddingTop: "6rem" }}>
				<div className='title'>
					<h1 id={post.title.replace(/\s+/g, "-")}>{post.title}</h1>
				</div>
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
			</div>
			<ToastContainer position='bottom-center' autoClose={2250} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover={false} theme={theme} />
			<Footer />
		</main>
	);
}

export async function getServerSideProps(context) {
	const { id, title } = context.query;

	// get data from db based on id ... (later)
	const getPost = await fetch(`${serverUrl}/api/v1/post/get/${id}`);

	if (getPost.status === 404) {
		return {
			notFound: true,
		};
	}

	const post = await getPost.json();
	let postTitle = post[0].title;

	// replace space with dash and encode to url
	postTitle = encodeURIComponent(postTitle.replace(/\s+/g, "-"));

	// enforce title
	if (postTitle !== title) {
		return {
			redirect: {
				permanent: false,
				source: `/r/${id}/${title}`,
				destination: `/r/${id}/${postTitle}`,
			},
		};
	}

	// return post data
	return {
		props: {
			post: post,
		},
	};
}
