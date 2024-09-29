'use client';

import Link from 'next/link';
import { useState } from 'react';
import '../../styles/global.css';
import WebGLInitializer from './webgl';

export default function Hero({}) {
	return (
		<div className="align-center flex flex h-screen flex-col items-center justify-center justify-center">
			<div className="xmin-h-screen absolute absolute -top-[10vh] flex w-full sm:top-0">
				<WebGLInitializer />
			</div>
			<Content />
		</div>
	);
}

function Content() {
	return (
		<div className="hero-content z-10 mt-10 flex min-h-[65vh] w-[90vw] flex-col justify-between p-6 text-white sm:mt-28 sm:min-h-[77.5vh] sm:w-[76vw]">
			<div className="helvetica flex justify-between">
				<div className="flex items-center">
					<div className="mr-[1.5vw] hidden h-2.5 w-2.5 rounded-full bg-white sm:block 2xl:h-[.75vw] 2xl:w-[.75vw]"></div>
					<span className="text-sm 2xl:text-[1vw] 2xl:leading-[1vw]">
						Deploy Serverless
					</span>
				</div>
				<div className="flex items-center">
					<span className="text-sm 2xl:text-[1vw] 2xl:leading-[1vw]">
						Develop Local-first
					</span>
					<div className="ml-[1.5vw] hidden h-2.5 w-2.5 rounded-full bg-white sm:block 2xl:h-[.75vw] 2xl:w-[.75vw]"></div>
				</div>
			</div>

			<div className="flex flex-col items-center sm:items-start">
				<div className="helvetica flex w-full flex-col-reverse items-center justify-between sm:flex-row sm:items-start">
					<div className="text-left sm:max-w-[40%]">
						<div className="text-center text-sm sm:text-left 2xl:text-[1vw] 2xl:leading-[1.5vw]">
							<strong> Base AI: </strong> The Web AI Framework.
							<p>
								Built for developers who want to build
								AI-powered web applications. Local-first,
								agentic pipes, tools, and memory.
							</p>
						</div>
					</div>
					<div className="flex h-max items-center">
						<span className="mb-5 text-sm sm:mb-0 2xl:text-[1vw] 2xl:leading-[1vw]">
							Agentic Pipes, Tools, Memory
						</span>
						<div className="ml-[1.5vw] hidden h-2.5 w-2.5 rounded-full bg-white sm:block 2xl:h-[.75vw] 2xl:w-[.75vw]"></div>
					</div>
				</div>

				<div className="sm:justify-left flex space-x-4">
					<Link
						href={`/docs`}
						className="flex items-center rounded-full bg-gray-200 px-4 py-2 text-xs text-black outline-1 outline-[#2A2A2A] transition-colors hover:bg-[#282828] hover:text-white hover:outline 2xl:px-[1vw]  2xl:py-[.65vw] 2xl:text-[.85vw] 2xl:leading-[1vw]"
						aria-label="Visit Github"
					>
						Get Started
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="ml-2 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
							/>
						</svg>
					</Link>
					<Link
						href={`/learn`}
						className="hover:bg-black-200 rounded-full bg-[#0E0E0E] px-4 py-2 text-xs text-white outline outline-1 outline-[#2A2A2A] transition-colors hover:bg-[#282828] 2xl:px-[1vw] 2xl:py-[.65vw] 2xl:text-[.85vw] 2xl:leading-[1vw]"
						aria-label="Learn BaseAi"
					>
						Learn BaseAI
					</Link>
				</div>
				<CopyableCommand command="npx baseai@latest" />
			</div>
		</div>
	);
}

interface CopyableCommandProps {
	command: string;
}

function CopyableCommand({ command }: CopyableCommandProps) {
	const [copied, setCopied] = useState(false);

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(command);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	return (
		<div
			className="group mb-4 mt-4 flex w-max cursor-pointer items-center justify-between font-mono text-sm transition-colors"
			onClick={copyToClipboard}
			role="button"
			tabIndex={0}
			onKeyDown={e => e.key === 'Enter' && copyToClipboard()}
			aria-label={`Copy command: ${command}`}
		>
			<div className="flex items-center space-x-2">
				<span className="text-gray-400 sm:text-sm 2xl:text-[1vw] 2xl:leading-[1.5vw]">
					~
				</span>
				<span className="font-mono text-gray-300 sm:text-sm 2xl:text-[1vw] 2xl:leading-[1.5vw]">
					{command}
				</span>
			</div>
			<div className="ml-2 text-gray-400 transition-colors group-hover:text-gray-300 sm:text-sm 2xl:text-[1vw] 2xl:leading-[1.5vw]">
				{copied ? (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-[1em] w-[1em]"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clipRule="evenodd"
						/>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-[1em] w-[1em]"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
						/>
					</svg>
				)}
			</div>
		</div>
	);
}
