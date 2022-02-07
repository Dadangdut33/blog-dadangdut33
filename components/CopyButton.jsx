import CopyToClipboard from "react-copy-to-clipboard";
import { useState } from "react";

export default function CopyButton({ text, onCopy }) {
	const [copiedClass, setCopiedClass] = useState("fa fa-clipboard");
	const [copyTimeout, setCopyTimeout] = useState(null);

	const onCopyCallback = () => {
		setCopiedClass("fas fa-clipboard-check");

		clearTimeout(copyTimeout);
		setCopyTimeout(
			setTimeout(() => {
				setCopiedClass("fa fa-clipboard");
			}, 2500)
		);
	};

	return (
		<CopyToClipboard text={text}>
			<div className='copy-btn'>
				<button
					className='btn btn-outline-info btn-copy'
					onClick={() => {
						onCopyCallback();
						onCopy("Copied to clipboard!");
					}}
				>
					<i className={copiedClass} aria-hidden='true' />
				</button>
			</div>
		</CopyToClipboard>
	);
}
