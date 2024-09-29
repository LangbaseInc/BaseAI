export function HeroPattern() {
	return (
		<div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
			<div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
				<div className="absolute inset-0 bg-gradient-to-r from-[#fad000] to-[#818CF8] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#fad000]/30 dark:to-[#818CF8]/30 dark:opacity-100"></div>
				<svg
					viewBox="0 0 1113 440"
					aria-hidden="true"
					className="xdark:hidden absolute left-1/2 top-0 ml-[-19rem] hidden w-[69.5625rem] fill-white blur-[26px] "
				>
					<path d="M.016 439.5s-9.5-300 434-300S882.516 20 882.516 20V0h230.004v439.5H.016Z" />
				</svg>
			</div>
		</div>
	);
}
