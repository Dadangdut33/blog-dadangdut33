import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { generateRSSFeed } from "../lib/rss";
import { ThemeProvider, Typography, IconButton, Paper } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useState } from "react";
import { Brightness7, Brightness3 } from "@mui/icons-material";

export default function Home(props) {
	const [theme, setTheme] = useState(true);
	const icon = !theme ? <Brightness7 /> : <Brightness3 />;
	const appliedTheme = createTheme({
		palette: {
			mode: theme ? "dark" : "light",
		},
	});

	return (
		<ThemeProvider theme={appliedTheme}>
			<Paper>
				<Typography variant='h3'>Hello!</Typography>
				<IconButton edge='end' color='inherit' aria-label='mode' onClick={() => setTheme(!theme)}>
					{icon}
				</IconButton>
				<Typography>
					Click on {!theme ? "Sun" : "Moon"} Icon to change to {!theme ? "Light" : "Dark"} theme
				</Typography>
			</Paper>
		</ThemeProvider>
	);
}

export async function getServerSideProps(res) {
	const response = await fetch("http://localhost:3000/api/v1/post/get/all", {});
	const data = await response.json();

	generateRSSFeed(data);

	return {
		props: { test: data },
	};
}
