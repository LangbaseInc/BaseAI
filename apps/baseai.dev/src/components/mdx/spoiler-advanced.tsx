import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';

export function SpoilerAdvanced({
	title,
	sub,
	children
}: {
	title: string;
	sub?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Accordion
			type="single"
			collapsible
			className="border-1 xborder-border xbg-background mb-0 mb-4 rounded-2xl border border-border px-4 [&>div>h3]:m-0"
		>
			<AccordionItem value={title} className="border-none">
				<AccordionTrigger>
					<div className="flex flex-col items-start justify-start text-left">
						<h3 className="no-prose m-0 text-[0.9rem] text-[#7E79D8] sm:text-lg">
							{title}
						</h3>
						<div className="m-0 text-muted-foreground/80">
							{sub}
						</div>
					</div>
				</AccordionTrigger>
				<AccordionContent>{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
