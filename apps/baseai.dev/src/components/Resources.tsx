'use client';

import {
	motion,
	useMotionTemplate,
	useMotionValue,
	type MotionValue
} from 'framer-motion';
import Link from 'next/link';

import { GridPattern } from '@/components/GridPattern';
import { Heading } from '@/components/Heading';

import { IconApi } from './ui/iconists/icon-api';
interface Resource {
	href: string;
	name: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
	pattern: Omit<
		React.ComponentPropsWithoutRef<typeof GridPattern>,
		'width' | 'height' | 'x'
	>;
}

const resources: Array<Resource> = [
	{
		href: '/api-reference/pipe/generate',
		name: 'Generate',
		description:
			'Learn about the generate API and how to use it to generate completions from a generate.',
		icon: IconApi,
		pattern: {
			y: 16,
			squares: [
				[0, 1],
				[1, 3]
			]
		}
	},
	{
		href: '/api-reference/pipe/chat',
		name: 'Chat',
		description:
			'Learn about the chat API and how to use it to generate chat completions from a chat pipe.',
		icon: IconApi,
		pattern: {
			y: 16,
			squares: [
				[0, 1],
				[1, 3]
			]
		}
	}
	// {
	//   href: '/conversations',
	//   name: 'Conversations',
	//   description:
	//     'Learn about the conversation model and how to create, retrieve, update, delete, and list conversations.',
	//   icon: ChatBubbleIcon,
	//   pattern: {
	//     y: -6,
	//     squares: [
	//       [-1, 2],
	//       [1, 3],
	//     ],
	//   },
	// },
	// {
	//   href: '/messages',
	//   name: 'Messages',
	//   description:
	//     'Learn about the message model and how to create, retrieve, update, delete, and list messages.',
	//   icon: EnvelopeIcon,
	//   pattern: {
	//     y: 32,
	//     squares: [
	//       [0, 2],
	//       [1, 4],
	//     ],
	//   },
	// },
	// {
	//   href: '/groups',
	//   name: 'Groups',
	//   description:
	//     'Learn about the group model and how to create, retrieve, update, delete, and list groups.',
	//   icon: UsersIcon,
	//   pattern: {
	//     y: 22,
	//     squares: [[0, 1]],
	//   },
	// },
];

function ResourceIcon({ icon: Icon }: { icon: Resource['icon'] }) {
	return (
		<div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#19182E]/5 ring-1 ring-[#19182E]/25 backdrop-blur-[2px] transition duration-300 group-hover:bg-white/50  group-hover:ring-[#7d79d8] dark:bg-white/7.5 dark:ring-white/15 dark:group-hover:bg-[#19182E]/10">
			<Icon className="h-5 w-5 fill-[#19182E]/10 stroke-[#19182E] transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-[#fad000] dark:group-hover:fill-[#fad000]/10 dark:group-hover:stroke-[#fad000]" />
		</div>
	);
}

function ResourcePattern({
	mouseX,
	mouseY,
	...gridProps
}: Resource['pattern'] & {
	mouseX: MotionValue<number>;
	mouseY: MotionValue<number>;
}) {
	let maskImage = useMotionTemplate`radial-gradient(180px at ${mouseX}px ${mouseY}px, white, transparent)`;
	let style = { maskImage, WebkitMaskImage: maskImage };

	return (
		<div className="pointer-events-none">
			<div className="absolute inset-0 rounded-2xl transition duration-300 [mask-image:linear-gradient(white,transparent)] group-hover:opacity-50">
				<GridPattern
					width={72}
					height={56}
					x="50%"
					className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/[0.02] stroke-black/5 dark:fill-white/1 dark:stroke-white/2.5"
					{...gridProps}
				/>
			</div>
			<motion.div
				className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#fad000]/25 to-[#19182E]/10 opacity-0 transition duration-300 group-hover:opacity-100 dark:from-[#fad000]/30 dark:to-[#19182E]/80"
				style={style}
			/>
			<motion.div
				className="absolute inset-0 rounded-2xl opacity-0 mix-blend-overlay transition duration-300 group-hover:opacity-100"
				style={style}
			>
				<GridPattern
					width={72}
					height={56}
					x="50%"
					className="absolute inset-x-0 inset-y-[-30%] h-[160%] w-full skew-y-[-18deg] fill-black/50 stroke-black/70 dark:fill-white/2.5 dark:stroke-white/10"
					{...gridProps}
				/>
			</motion.div>
		</div>
	);
}

function Resource({ resource }: { resource: Resource }) {
	let mouseX = useMotionValue(0);
	let mouseY = useMotionValue(0);

	function onMouseMove({
		currentTarget,
		clientX,
		clientY
	}: React.MouseEvent<HTMLDivElement>) {
		let { left, top } = currentTarget.getBoundingClientRect();
		mouseX.set(clientX - left);
		mouseY.set(clientY - top);
	}

	return (
		<div
			key={resource.href}
			onMouseMove={onMouseMove}
			className="group relative flex rounded-2xl transition-shadow dark:hover:shadow-md dark:hover:shadow-black/5"
		>
			<div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-zinc-900/7.5 transition duration-300 group-hover:ring-[#7d79d8] dark:ring-white/10" />
			<div className="relative rounded-2xl px-4 pb-4 pt-16">
				<ResourceIcon icon={resource.icon} />
				<h3 className="leading-7mb-2 mt-4 flex items-center text-lg font-semibold text-black dark:text-white">
					<Link href={resource.href}>
						<span className="absolute inset-0 rounded-2xl" />
						{resource.name}
					</Link>
				</h3>
				<p className="mt-1 text-base text-zinc-600 dark:text-zinc-400">
					{resource.description}
				</p>
			</div>
		</div>
	);
}

export function Resources() {
	return (
		<div className="my-16 xl:max-w-none">
			<Heading level={2} id="resources">
				API Reference
			</Heading>
			<div className="not-prose mt-4 grid grid-cols-1 gap-8 border-t border-zinc-900/5 pt-10 sm:grid-cols-2 dark:border-white/5">
				{resources.map(resource => (
					<Resource key={resource.href} resource={resource} />
				))}
			</div>
		</div>
	);
}
