import GoHome from '../../ui/go-home';
import ChatAdvancedExample from '../../chat-advanced';

export const ChatAdvanced = () => {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				`usePipe()`: Chat Advanced
			</h1>

			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				A kitchen sink example with all `usePipe()` chat features
			</p>

			<ChatAdvancedExample />
		</div>
	);
};
