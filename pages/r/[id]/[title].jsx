import Image from "next/image";
import { useEffect, useState } from "react";
import { useCookie } from "next-cookie";
import { randomBytes } from "crypto";
import { serverUrl } from "../../../lib/server_url";
import load_bootstrapjs from "../../../lib/load_bootstrapjs";
import Meta from "../../../components/meta";
import NavBar from "../../../components/navbar";
import Footer from "../../../components/footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function postIdWithTitle(props) {
	const post = props.post[0];

	return (
		<div>
			<h1>
				Hello World {post.id} {post.title}
			</h1>
			<p>{post.description}</p>
			<ReactMarkdown className='markdown-body' children={post.content} remarkPlugins={[remarkGfm]} />,
		</div>
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
