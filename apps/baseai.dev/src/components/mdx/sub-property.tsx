import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/components/ui/accordion';
import { Property } from './Property';

export function Sub({
	name,
	type,
	children
}: {
	name: string;
	type: string;
	children: React.ReactNode;
}) {
	return (
		<Accordion
			type="single"
			collapsible
			className="border-1 mb-0 mb-4 rounded-2xl border border-border px-4 [&>div>h3]:m-0"
		>
			<AccordionItem value={name + type} className="border-none">
				<AccordionTrigger>{name}</AccordionTrigger>
				<AccordionContent>
					<Property name={name} type={type}>
						{children}
					</Property>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
