import { Link } from "@remix-run/react";

export default function GoHome() {
	return (
		<Link
			to="/"
			className="text-sm my-4 mx-0 block bg-white rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 text-muted-foreground absolute top-0 left-4"
		>
			← More examples
		</Link>
	);
}
