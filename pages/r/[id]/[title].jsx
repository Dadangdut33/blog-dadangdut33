import { useRouter } from "next/router";
export default function postIdWithTitle() {
	const router = useRouter();
	const { id, title } = router.query;
	return (
		<div>
			<h1>
				Hello World {id} {title}
			</h1>
		</div>
	);
}
