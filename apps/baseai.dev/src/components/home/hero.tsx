'use client';

import cn from 'mxcn';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import '../../styles/global.css';
import { Anchor } from '../ui/anchor';
import { IconDocs } from '../ui/iconists/icon-docs';
import WebGLInitializer from './webgl';
const inter = Inter({ subsets: ['latin'] });

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
		<div
			className={cn(
				'hero-content z-10 mt-10 flex min-h-[65vh] w-[90vw] flex-col justify-between p-6 text-white sm:mt-24 sm:min-h-[77.5vh] sm:w-[76vw]'
			)}
		>
			<div className={cn(' flex justify-between', inter.className)}>
				<div className="flex items-center">
					<div className="mr-4 hidden size-4 rounded-full bg-muted-foreground/70 sm:block"></div>
					<span className="text-sm text-muted-foreground/70 2xl:text-[1vw] 2xl:leading-[1vw]">
						dev local-first
					</span>
				</div>
				<div className="flex items-center">
					<span className="text-sm text-muted-foreground/70 2xl:text-[1vw] 2xl:leading-[1vw]">
						deploy serverless
					</span>
					<div className="ml-4 hidden size-4 rounded-full bg-muted-foreground/70 sm:block"></div>
				</div>
			</div>

			<div
				className={cn(
					'mt-[16rem] flex flex-col items-center sm:mt-[22rem] lg:mt-[28rem] lg:mt-[28rem] 2xl:mt-[40rem]'
				)}
			>
				<div
					className={cn(
						'flex w-full flex-col-reverse items-center justify-between lg:flex-row lg:items-start',
						inter.className
					)}
				>
					<div className="text-left lg:max-w-[60%]">
						<div className="text-center text-sm lg:text-left 2xl:text-[1vw] 2xl:leading-[1.5vw]">
							<div className="flex items-center justify-center lg:justify-start">
								<div className="mr-4 hidden size-4 rounded-full bg-muted-foreground/70 sm:block"></div>
								<span className="text-sm text-muted-foreground/70 2xl:text-[1vw] 2xl:leading-[1vw]">
									<strong className="mr-2 text-white">
										Base AI
									</strong>{' '}
									<span className="text-muted-foreground/90">
										The first Web AI Framework.
									</span>
								</span>
							</div>
							<p className="mr-4 mt-4 text-muted-foreground/90 md:max-w-[500px] lg:max-w-full">
								The easiest way to build serverless autonomous
								AI agents with memory. Start building
								local-first, agentic pipes, tools, and memory.
								Deploy serverless with one command.
							</p>
						</div>
					</div>
					<div className="flex h-max items-center">
						<span className="mb-5 text-sm text-muted-foreground/70 lg:mb-0 2xl:text-[1vw] 2xl:leading-[1vw]">
							agentic{' '}
							<span className="text-muted-foreground/20">(</span>{' '}
							pipes{' '}
							<span className="text-muted-foreground/20">|</span>{' '}
							tools{' '}
							<span className="text-muted-foreground/20">|</span>{' '}
							memory{' '}
							<span className="text-muted-foreground/20">)</span>
						</span>
						<div className="ml-4 hidden size-4 rounded-full bg-muted-foreground/70 lg:block"></div>
					</div>
				</div>

				<div
					className={cn(
						'mx-auto mt-8 flex w-full items-center justify-center space-x-2 lg:items-start lg:justify-start'
					)}
				>
					<Anchor
						variant={'default'}
						href={`/docs`}
						aria-label="Get Started"
					>
						<IconDocs className="size-4" />
						<span className={inter.className}>Get Started</span>
					</Anchor>
					<Anchor
						variant={'secondary'}
						href={`/learn`}
						aria-label="Learn BaseAI"
					>
						Learn BaseAI
					</Anchor>
				</div>
				<CopyableCommand command="npx baseai@latest init" />
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
			className="group my-4 flex w-full cursor-pointer items-center justify-center font-mono text-sm transition-colors lg:items-start lg:justify-start "
			// "mx-auto mt-8 flex w-full items-center justify-center space-x-2 lg:items-start lg:justify-start"
			onClick={copyToClipboard}
			role="button"
			tabIndex={0}
			onKeyDown={e => e.key === 'Enter' && copyToClipboard()}
			aria-label={`Copy command: ${command}`}
		>
			<div className="group flex items-center space-x-2 transition-colors group-hover:text-indigo-400">
				<span className="text-muted-foreground/50 group-hover:text-indigo-400 sm:text-sm 2xl:leading-[1.5vw]">
					<span className="xtext-indigo-400">⌘</span>
					<span className="group-hover:text-muted-foreground/50">
						{' '}
						~
					</span>
				</span>
				<span className="font-mono text-muted-foreground/50 transition-colors group-hover:text-indigo-400 sm:text-sm 2xl:leading-[1.5vw] ">
					{command}
				</span>
				<div className="ml-2 text-muted-foreground/50 transition-colors group-hover:text-indigo-400 sm:text-sm 2xl:leading-[1.5vw]">
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
		</div>
	);
}
