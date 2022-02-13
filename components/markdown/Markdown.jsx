import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/cjs/styles/prism";
import CopyButton from "./CopyButton";

export default function Markdown({ text, onCopy, theme }) {
	return (
		<ReactMarkdown
			className='markdownBody'
			children={text}
			remarkPlugins={[gfm]}
			rehypePlugins={[rehypeRaw]}
			components={{
				code({ node, inline, className, children, ...props }) {
					const match = /language-(\w+)/.exec(className || "");
					return !inline && match ? (
						<div className='codeblock-wrapper'>
							<CopyButton text={String(children).replace(/\n$/, "")} onCopy={onCopy} />
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
	);
}
