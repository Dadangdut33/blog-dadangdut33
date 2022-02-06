import React from "react";
import darkLogo from "./dark.svg";
import lightLogo from "./light.svg";
import Image from "next/image";

export default function DarkModeToggle() {
	const [checked, setChecked] = React.useState(false);
	const [logo, setLogo] = React.useState(checked ? darkLogo : lightLogo);
	const setDarkMode = () => {
		setChecked(true);
		setLogo(darkLogo);
		document.querySelectorAll(".bg-light").forEach((element) => {
			element.className = element.className.replace(/-light/g, "-dark");
		});

		document.querySelectorAll(".text-dark").forEach((element) => {
			element.classList.replace("text-dark", "text-light");
		});

		document.querySelectorAll(".anchor-link").forEach((element) => {
			element.classList.replace("bot-light", "bot-dark");
		});

		// document body
		document.body.classList.add("bg-dark");
		if (document.body.classList.contains("text-dark")) {
			document.body.classList.replace("text-dark", "text-light");
		} else {
			document.body.classList.add("text-light");
		}
	};

	const setLightMode = () => {
		setChecked(false);
		setLogo(lightLogo);
		document.querySelectorAll(".bg-dark").forEach((element) => {
			element.className = element.className.replace(/-dark/g, "-light");
		});

		document.querySelectorAll(".text-light").forEach((element) => {
			element.classList.replace("text-light", "text-dark");
		});

		document.querySelectorAll(".anchor-link").forEach((element) => {
			element.classList.replace("bot-dark", "bot-light");
		});

		// document body
		document.body.classList.remove("bg-dark");
		if (document.body.classList.contains("text-light")) {
			document.body.classList.replace("text-light", "text-dark");
		} else {
			document.body.classList.add("text-dark");
		}
	};

	const toggleBgMode = () => {
		const currentMode = localStorage.getItem("bgmode");
		const newMode = currentMode === "dark" ? "light" : "dark";
		localStorage.setItem("bgmode", newMode);

		if (newMode === "dark") {
			setDarkMode();
		} else {
			setLightMode();
		}
	};

	const getSystemDefaultTheme = () => {
		return window.matchMedia("(prefers-color-scheme: dark)").matches;
	};

	React.useEffect(() => {
		let currentMode = localStorage.getItem("bgmode");
		if (currentMode == null) {
			currentMode = getSystemDefaultTheme();
			currentMode = currentMode ? "dark" : "light";
			localStorage.setItem("bgmode", currentMode);
		}

		if (currentMode === "dark") {
			setChecked(true);
			setLogo(darkLogo);
			let checkExist = setInterval(function () {
				if (document.querySelectorAll(".bg-light").length > 0) {
					clearInterval(checkExist);
					setDarkMode();
				}
			}, 100); // check every 100ms (check until element is found)
		} else {
			setLightMode();
		}
	}, []);

	return (
		<div className='form-check form-switch ms-auto mt-3 me-3 darkmode-toggler'>
			<label className='form-check-label ms-3' htmlFor='lightSwitch' style={{ marginLeft: "3px", cursor: "pointer" }}>
				<Image src={logo} className='bi bi-brightness-high light-svg' width={"25"} height={"25"} fill='white' alt='light/dark toggler' viewBox='0 0 16 16' />
			</label>
			<input className='form-check-input darkmode-toggler-btn' type={"checkbox"} id='lightSwitch' onChange={toggleBgMode} checked={checked} style={{ marginLeft: "0px", cursor: "pointer" }} />
		</div>
	);
}
