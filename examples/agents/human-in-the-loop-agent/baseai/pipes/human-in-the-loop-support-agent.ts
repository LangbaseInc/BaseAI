import {PipeI} from '@baseai/core';
import toolHandoffToHuman from '../tools/handoff-to-human';

const pipeHumanInTheLoopSupportAgent = (): PipeI => ({
	// Replace with your API key https://langbase.com/docs/api-reference/api-keys
	apiKey: process.env.LANGBASE_API_KEY!,
	name: 'human-in-the-loop-support-agent',
	description:
		'An IT Support Human in the Loop (HITL) agent with ability to handoff to a human support resource based on issue severity or user request',
	status: 'public',
	model: 'openai:gpt-4o-mini',
	stream: true,
	json: false,
	store: true,
	moderate: true,
	top_p: 1,
	max_tokens: 1000,
	temperature: 0.7,
	presence_penalty: 1,
	frequency_penalty: 1,
	stop: [],
	tool_choice: 'auto',
	parallel_tool_calls: true,
	messages: [
		{
			role: 'system',
			content: `You are an IT Support Escalation Agent. Your role is to assist users by gathering information, diagnosing common IT issues, and providing clear troubleshooting steps. When an issue requires human intervention, you will escalate it using the needs_human_approval tool.

Guidelines:

1. Collect Key Information:
   Ask the user for details such as the problem description, affected systems, error messages, and steps already attempted.

2. Diagnose and Suggest Solutions:
   Offer basic troubleshooting steps in clear, easy-to-follow instructions.

3. Assess Escalation Need:
   If an issue is complex, critical, or unresolved after initial steps, call the handoff_to_human tool with information about the issue's severity, number of affected users, and urgency.

4. Be Empathetic and Transparent:
   If escalating, reassure the user and let them know a specialist will handle the issue promptly.`,
		},
	],
	variables: [],
	memory: [],
	tools: [toolHandoffToHuman()],
});

export default pipeHumanInTheLoopSupportAgent;
