import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, streamText, UIMessage } from 'ai'
import {createOpenRouter } from '@openrouter/ai-sdk-provider'
import { env } from '@/env'

const openrouter = createOpenRouter({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.AI_API_KEY_DEEPSEEK ?? '',
})

const systemPrompt = `You are a helpful AI assistant for DevPlanKit, a project management and idea tracking application for developers.

Your role is to help developers:
- Brainstorm and refine project ideas
- Plan development tasks and milestones
- Suggest tech stacks based on project requirements
- Help structure project documentation
- Provide guidance on software architecture decisions

Be concise, practical, and focused on actionable advice. When discussing technical topics, consider modern best practices and the developer's context.`

export const Route = createFileRoute('/api/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages }: { messages: UIMessage[] } = await request.json();

        const result = streamText({
          model: openrouter('deepseek/deepseek-r1-0528:free'),
          messages: await convertToModelMessages(messages),
          system: systemPrompt,
        });

        return result.toUIMessageStreamResponse();
      },
    },
  },
});
