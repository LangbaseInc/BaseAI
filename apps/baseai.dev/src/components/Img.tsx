import { IconImg } from './ui/icons/img';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ImgProps {
	width: number;
	height: number;
	src?: string;
	alt: string;
	caption?: string;
	light: string;
	dark: string;
	[propName: string]: any; // This line allows additional props to be passed
}

export default function Img({
	width,
	height,
	src,
	alt,
	caption,
	light,
	dark,
	...props
}: ImgProps) {
	const finalAlt = alt || caption;

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<figure
						className="not-prose relative cursor-zoom-in"
						style={{ marginBlock: '40px' }}
					>
						<div className="not-prose relative overflow-hidden rounded-xl bg-background p-2 ring-2 ring-border">
							<div className="relative flex h-full w-full justify-center overflow-hidden rounded-lg">
								{src && (
									<img
										alt={finalAlt}
										src={src}
										width={width}
										height={height}
										style={{
											width: '100%',
											height: 'auto',
											color: 'transparent'
										}}
										className="block max-w-full rounded-md object-cover shadow"
									/>
								)}
								{light && (
									<img
										alt={finalAlt}
										src={light}
										loading="lazy"
										width={width}
										height={height}
										style={{
											width: '100%',
											height: 'auto',
											color: 'transparent'
										}}
										className="block max-w-full rounded-md object-cover shadow dark:hidden"
									/>
								)}
								{dark && (
									<img
										alt={finalAlt}
										src={dark}
										loading="lazy"
										width={width}
										height={height}
										style={{
											width: '100%',
											height: 'auto',
											color: 'transparent'
										}}
										className="block hidden max-w-full rounded-md object-cover shadow dark:block"
									/>
								)}
							</div>
						</div>
						{caption && (
							<figcaption className="mt-[28px] flex items-center justify-center gap-2 text-center text-sm">
								<IconImg
									className="inline-block h-4 w-4 text-muted-foreground/50"
									aria-hidden="true"
								/>
								<span>{caption}</span>
							</figcaption>
						)}
					</figure>
				</DialogTrigger>
				<DialogContent className="border-border bg-background p-0 sm:max-w-[90%]">
					{src && (
						<img
							alt={finalAlt}
							src={src}
							loading="lazy"
							width={width}
							height={height}
							style={{
								width: '100%',
								height: 'auto',
								color: 'transparent'
							}}
							className="block max-w-full rounded-md object-cover shadow"
						/>
					)}
					{light && (
						<img
							alt={finalAlt}
							src={light}
							loading="lazy"
							width={width}
							height={height}
							style={{
								width: '100%',
								height: 'auto',
								color: 'transparent'
							}}
							className="block max-w-full rounded-md object-cover shadow dark:hidden"
						/>
					)}
					{dark && (
						<img
							alt={finalAlt}
							src={dark}
							loading="lazy"
							width={width}
							height={height}
							style={{
								width: '100%',
								height: 'auto',
								color: 'transparent'
							}}
							className="block hidden max-w-full rounded-md object-cover shadow dark:block"
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
