import { createFileRoute } from '@tanstack/react-router'
import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { env } from '@/env'

const openrouter = createOpenRouter({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.AI_API_KEY_DEEPSEEK ?? '',
})

const systemPrompt = `You are an expert Requirements Engineer. Your role is to help create comprehensive requirements documents.

## Expertise:
- User Stories (As a [role], I want [feature], so that [benefit])
- Functional and Non-Functional Requirements
- Acceptance Criteria (Given/When/Then format)
- MVP Definition, User Personas, Risk Assessment
- MoSCoW Prioritization (Must Have, Should Have, Could Have, Won't Have)

## Response Format:

When ADDING new content to the document, respond with a JSON block:
\`\`\`json
{
  "action": "add",
  "section": "## Section Title",
  "content": "Markdown content to add...",
  "insertAfter": "## Existing Section"
}
\`\`\`
Use "insertAfter": "end" to append at the end of the document.

When MODIFYING existing content, respond with:
\`\`\`json
{
  "action": "modify",
  "targetSection": "## Section Name",
  "newContent": "Complete replacement content for that section..."
}
\`\`\`

For ANALYSIS or general discussion (no document changes needed), respond WITHOUT any JSON block.

IMPORTANT:
- After the JSON block, always include a brief explanation of what changes were made
- Keep the markdown content well-formatted and professional
- Use proper markdown syntax (headers, lists, tables, checkboxes)
- Be specific and actionable in requirements
- Consider edge cases and non-functional requirements`

export const Route = createFileRoute('/api/chat/requirements')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages, documentContext }: { messages: UIMessage[]; documentContext?: string } = await request.json()

        const contextualSystemPrompt = documentContext
          ? `${systemPrompt}\n\n## Current Document:\n\`\`\`markdown\n${documentContext}\n\`\`\`\n\nAnalyze the current document and make changes based on the user's request.`
          : systemPrompt

        const result = streamText({
          model: openrouter('deepseek/deepseek-r1-0528:free'),
          messages: await convertToModelMessages(messages),
          system: contextualSystemPrompt,
        })

        return result.toUIMessageStreamResponse()
      },
    },
  },
})
