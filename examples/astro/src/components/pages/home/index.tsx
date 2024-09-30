export const Home = () => {
	const examples = [
		{ title: 'Pipe Run', href: '/demo/pipe-run' },
		{ title: 'Pipe Run Stream', href: '/demo/pipe-run-stream' },
		{ title: 'Chat Simple', href: '/demo/chat-simple' },
		{ title: 'Chat Advanced', href: '/demo/chat-advanced' },
		{ title: 'Tool Calling', href: '/demo/tool-calling' },
		{
			title: 'Tool Calling: Pipes as Tools',
			href: '/demo/pipe-run-pipes-as-tools',
		},
		{ title: 'Memory', href: '/demo/memory' },
	];
	return (
		<div className="w-full max-w-md">
			<h1 className="text-3xl font-light text-gray-800 mb-8 text-center">
				Examples
			</h1>
			<ul className="space-y-3">
				{examples.map((example, index) => (
					<li key={index}>
						<a
							href={example.href}
							className="block bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
						>
							<div className="flex items-center justify-between">
								<span className="text-lg text-gray-700">
									{example.title}
								</span>
								<svg
									className="w-5 h-5 text-gray-400"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path d="M9 5l7 7-7 7"></path>
								</svg>
							</div>
						</a>
					</li>
				))}
			</ul>
		</div>
	);
};
