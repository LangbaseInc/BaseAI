import {ToolI} from '@baseai/core';

export async function handoffToHuman() {
	// Add your tool logic here
	// This function will be called when the tool is executed
}

const toolHandoffToHuman = (): ToolI => ({
	run: handoffToHuman,
	type: 'function' as const,
	function: {
		name: 'handoff_to_human',
		description:
			'Generates a structured summary of an IT issue for human agents to quickly understand and take action.',
		parameters: {
			type: 'object',
			properties: {
				issue_title: {
					type: 'string',
					description: 'A brief title summarizing the core issue.',
				},
				affected_systems: {
					type: 'array',
					items: {
						type: 'string',
					},
					description:
						'A list of systems, applications, or services impacted by the issue.',
				},
				error_message: {
					type: 'string',
					description:
						'The specific error message(s) reported by the user or detected during troubleshooting.',
				},
				number_of_users_affected: {
					type: 'number',
					description:
						'The estimated number of users impacted by this issue.',
				},
				steps_attempted: {
					type: 'array',
					items: {
						type: 'string',
					},
					description:
						'A list of troubleshooting steps that the AI agent suggested and that the user has already tried.',
				},
				severity_level: {
					type: 'string',
					enum: ['Low', 'Medium', 'High', 'Critical'],
					description:
						'The severity of the issue based on the AI agent’s assessment.',
				},
				additional_notes: {
					type: 'string',
					description:
						'Any other contextual information, observations, or details provided by the user that may help the human agent.',
				},
			},
			required: [
				'issue_title',
				'affected_systems',
				'error_message',
				'number_of_users_affected',
				'steps_attempted',
				'severity_level',
			],
		},
	},
});

export default toolHandoffToHuman;
