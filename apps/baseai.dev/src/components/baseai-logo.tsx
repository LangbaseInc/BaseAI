import { cn } from "@/lib/utils";

export default function BaseAILogo({width = '30%', className}: {width?: string, className?: string}) {
	return (
		<>
			<img
				alt="BaseAI"
				src="https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-light-mode.png"
				loading="lazy"
				width={width}
				style={{
					height: 'auto',
					color: 'transparent'
				}}
				className={cn("block max-w-full object-cover dark:hidden", className)}
			/>
			<img
				alt="BaseAI"
				src="https://raw.githubusercontent.com/LangbaseInc/docs-images/refs/heads/main/baseai/baseai-logo.png"
				loading="lazy"
				width={width}
				style={{
					height: 'auto',
					color: 'transparent'
				}}
				className={cn("hidden max-w-full object-cover dark:block", className)}
			/>
		</>
	);
}
