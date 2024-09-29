import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';

export function Spoiler({
	title,
	children
}: {
	title: string;
	children: React.ReactNode;
}) {
	return (
		<Accordion
			type="single"
			collapsible
			className="border-1 mb-0 mb-4 rounded-2xl border border-border px-4 [&>div>h3]:m-0"
		>
			<AccordionItem value={title} className="border-none">
				<AccordionTrigger>
					<h3 className="m-0">{title}</h3>
				</AccordionTrigger>
				<AccordionContent>{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
