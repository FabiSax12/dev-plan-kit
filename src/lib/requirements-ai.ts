import { z } from 'zod'

// Schema for "add" action
const AddActionSchema = z.object({
  action: z.literal('add'),
  section: z.string(),
  content: z.string(),
  insertAfter: z.string().optional(),
})

// Schema for "modify" action
const ModifyActionSchema = z.object({
  action: z.literal('modify'),
  targetSection: z.string(),
  newContent: z.string(),
})

// Discriminated union for AI responses
export const AIResponseSchema = z.discriminatedUnion('action', [
  AddActionSchema,
  ModifyActionSchema,
])

export type AIResponse = z.infer<typeof AIResponseSchema>
export type AddAction = z.infer<typeof AddActionSchema>
export type ModifyAction = z.infer<typeof ModifyActionSchema>

/**
 * Parses a JSON block from the AI response text.
 * The AI typically responds with a ```json block followed by explanation text.
 */
export function parseAIResponse(text: string): { change: AIResponse | null; explanation: string } {
  // Try to find JSON in code blocks first
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/)

  if (jsonBlockMatch) {
    try {
      const jsonStr = jsonBlockMatch[1].trim()
      const parsed = JSON.parse(jsonStr)
      const validated = AIResponseSchema.parse(parsed)

      // Extract explanation (text after the JSON block)
      const afterJson = text.substring(text.indexOf('```', jsonBlockMatch.index! + 7) + 3).trim()

      return {
        change: validated,
        explanation: afterJson || 'Changes applied.',
      }
    } catch (error) {
      // JSON parsing or validation failed
      console.error('Failed to parse AI response JSON:', error)
    }
  }

  // No valid JSON found - this is an analysis/discussion response
  return {
    change: null,
    explanation: text,
  }
}

/**
 * Applies an AI-suggested change to the document.
 */
export function applyChange(document: string, change: AIResponse): string {
  if (change.action === 'add') {
    return applyAddAction(document, change)
  } else if (change.action === 'modify') {
    return applyModifyAction(document, change)
  }

  return document
}

/**
 * Applies an "add" action - inserts new content at the specified location.
 */
function applyAddAction(document: string, action: AddAction): string {
  const { section, content, insertAfter } = action

  // Full content to insert (section header + content)
  const fullContent = `${section}\n${content}`

  if (insertAfter === 'end' || !insertAfter) {
    // Append to end of document
    return document.trimEnd() + '\n\n' + fullContent + '\n'
  }

  // Find the insertAfter section and insert after it
  const sectionPattern = new RegExp(
    `(${escapeRegExp(insertAfter)}[\\s\\S]*?)(?=\\n##\\s|$)`,
    'i'
  )

  const match = document.match(sectionPattern)

  if (match) {
    const insertPosition = match.index! + match[0].length
    return (
      document.slice(0, insertPosition).trimEnd() +
      '\n\n' +
      fullContent +
      '\n' +
      document.slice(insertPosition)
    )
  }

  // If insertAfter section not found, append to end
  return document.trimEnd() + '\n\n' + fullContent + '\n'
}

/**
 * Applies a "modify" action - replaces the target section's content.
 */
function applyModifyAction(document: string, action: ModifyAction): string {
  const { targetSection, newContent } = action

  // Pattern to match the section and its content until the next same-level or higher heading
  const headerLevel = (targetSection.match(/^#+/) || ['##'])[0].length
  const sectionPattern = new RegExp(
    `(${escapeRegExp(targetSection)})([\\s\\S]*?)(?=\\n#{1,${headerLevel}}\\s|$)`,
    'i'
  )

  const match = document.match(sectionPattern)

  if (match) {
    // Replace the section content but keep the header
    const newSectionContent = `${targetSection}\n${newContent}`
    return (
      document.slice(0, match.index!) +
      newSectionContent +
      document.slice(match.index! + match[0].length)
    )
  }

  // Section not found - append as new section
  return document.trimEnd() + '\n\n' + targetSection + '\n' + newContent + '\n'
}

/**
 * Escapes special regex characters in a string.
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Extracts just the explanation part from an AI response (removes JSON blocks).
 */
export function extractExplanation(text: string): string {
  // Remove JSON code blocks and thinking blocks
  let cleaned = text
    .replace(/```json[\s\S]*?```/g, '')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .trim()

  return cleaned || 'Changes suggested.'
}
