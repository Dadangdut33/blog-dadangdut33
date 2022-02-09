import { Giscus } from "@giscus/react";

export default function Comment({ theme }) {
	return (
		<Giscus repo='dadangdut33/blog-dadangdut33' repoId='R_kgDOGwT24g' category='General' categoryId='DIC_kwDOGwT24s4CBAZ-' mapping='pathname' reactionsEnabled='1' emitMetadata='0' theme={theme} />
	);
}
