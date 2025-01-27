import type { Message } from 'types/pipe';

export function getMessageContent(message: Message): string | null {
	// Tool calls have no content
	if (!message?.content) return null;

	// If content is a string, return it
	if (typeof message.content === 'string') {
		return message.content;
	}

	/**
	 * If content is an array, find the text content part and return its text
	 *
	 * 1. Image messages have text and image content objects
	 * {"type": "text", "text": "What’s in this image?"},
	 *     {
	 *       "type": "image_url",
	 *       "image_url": {
	 *         "url": "",
	 *       },
	 *     },
	 *
	 * 2. Audio messages always have text and audio content objects
	 *  content: [
	 * 		{type: 'text', text: 'What is in this recording?'},
	 * 		{type: 'input_audio', input_audio: {data: base64str, format: 'wav'}},
	 * 	];
	 */

	if (Array.isArray(message.content)) {
		return message.content.find(item => item.type === 'text')?.text || null;
	}

	return null;
}
