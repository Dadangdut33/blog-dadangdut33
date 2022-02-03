import Head from "next/head";
import Image from "next/image";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";
import load_bootstrapjs from "../lib/load_bootstrapjs";
import DarkModeToggle from "../components/theme-switcher/DarkModeToggle";

export default function Home(props) {
	useEffect(() => {
		// load the cdn script after the page is loaded
		load_bootstrapjs(document);
	}, []);

	return (
		<>
			<Head>
				<title>Dadangdut33 - Blog</title>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<NavBar />
			<DarkModeToggle />
			<h1>Test</h1>
		</>
	);
}

export async function getServerSideProps(res) {
	const response = await fetch("http://localhost:3000/api/v1/post/get/all", {});
	const data = await response.json();

	// import { generateRSSFeed } from "../lib/rss";
	// generateRSSFeed(data);

	return {
		props: { test: data },
	};
}
