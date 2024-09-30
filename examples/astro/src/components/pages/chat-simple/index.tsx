import GoHome from '../../ui/go-home';
import ChatSimpleExample from '../../chat-simple';

export const ChatSimple = () => {
	return (
		<div className="w-full max-w-md">
			<GoHome />

			<h1 className="text-2xl font-light text-gray-800 mb-1 text-center">
				`usePipe()`: Chat
			</h1>

			<p className="text-muted-foreground text-base font-light mb-20 text-center">
				Chat with the AI agent
			</p>

			<ChatSimpleExample />
		</div>
	);
};
