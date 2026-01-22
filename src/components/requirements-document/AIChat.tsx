import { Send, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { AIResponse, applyChange, extractExplanation, parseAIResponse } from "@/lib/requirements-ai"
import { useChat } from "@ai-sdk/react"
import { useMemo, useRef, useState } from "react"
import { DefaultChatTransport } from "ai"

const SUGGESTED_PROMPTS = [
    "Add user personas section",
    "Generate acceptance criteria",
    "Identify potential risks",
    "Add priority matrix",
    "Expand technical requirements",
]

interface PendingChange {
    change: AIResponse
    explanation: string
    messageId: string
}

// Helper to extract text content from message parts
function getMessageText(message: { parts: Array<{ type: string; text?: string }> }): string {
    return message.parts
        .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
        .map((part) => part.text)
        .join('\n')
}

interface Props {
    hidden: boolean
    content: string
    contextName?: string
    updateContent?: (newContent: string) => void
}

export const AIChat = ({ hidden, content, contextName, updateContent }: Props) => {
    const [pendingChange, setPendingChange] = useState<PendingChange | null>(null)
    const [input, setInput] = useState("")

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Create transport with document context - memoize to avoid recreation
    const transport = useMemo(() => new DefaultChatTransport({
        api: '/api/chat/requirements',
        body: {
            documentContext: content,
        },
    }), [content])

    // AI Chat with useChat hook (V5 API)
    const {
        messages,
        sendMessage,
        status,
    } = useChat<{
        id: string;
        role: "assistant" | "user";
        parts: {
            type: "text";
            text: string;
        }[];
    }>({
        transport,
        messages: [
            {
                id: 'welcome',
                role: 'assistant',
                parts: [{
                    type: 'text',
                    text: `I'm here to help you build out the requirements document${contextName ? ` for **${contextName}**` : ""}. You can ask me to:\n\n- Add new sections (user personas, risks, constraints)\n- Expand on existing content\n- Generate acceptance criteria\n- Help organize and prioritize requirements\n\nJust describe what you need and I'll update the document.`,
                }],
            },
        ],
        onFinish: ({ message }) => {
            // Parse the AI response to check for document changes
            if (message.role === 'assistant') {
                const messageText = getMessageText(message)
                const { change, explanation } = parseAIResponse(messageText)
                if (change) {
                    setPendingChange({
                        change,
                        explanation,
                        messageId: message.id,
                    })
                }
            }
        },
    })

    const isLoading = status === 'submitted' || status === 'streaming'

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading) return
        const message = input.trim()
        setInput('')
        sendMessage({ text: message })
    }

    const handleApplyChange = () => {
        if (!pendingChange) return
        const newContent = applyChange(content, pendingChange.change)
        updateContent?.(newContent)
        setPendingChange(null)
    }

    const handleRejectChange = () => {
        setPendingChange(null)
    }

    if (hidden) {
        return <aside className="h-full relative">
            {/* <h1 className="rotate-90 origin-top -translate-y-1/2 text-nowrap">AI Assistant</h1> */}
            <h3 className="absolute top-1/2 -translate-y-1/2 left-0 origin-top rotate-90 text-nowrap">AI Assistant</h3>
        </aside>
    }

    return <>
        <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                        <div
                            className={cn(
                                "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                                message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                        >
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                            >
                                {message.role === 'assistant'
                                    ? extractExplanation(getMessageText(message))
                                    : getMessageText(message)}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {status === 'submitted' && (
                    <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
        </ScrollArea>

        {/* Pending Change Confirmation */}
        {pendingChange && (
            <div className="px-4 py-3 border-t bg-amber-50 dark:bg-amber-950/30">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">
                    Apply suggested changes?
                </p>
                <div className="flex gap-2">
                    <Button
                        size="sm"
                        variant="default"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={handleApplyChange}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Apply
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={handleRejectChange}
                    >
                        <XCircle className="h-3.5 w-3.5 mr-1" />
                        Reject
                    </Button>
                </div>
            </div>
        )}

        {/* Suggested Prompts */}
        <div className="px-4 py-2 border-t">
            <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                    <button
                        key={prompt}
                        onClick={() => setInput(prompt)}
                        className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                        {prompt}
                    </button>
                ))}
            </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                }}
                className="flex gap-2"
            >
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask AI to help with requirements..."
                    className="min-h-11 max-h-32 resize-none"
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                        }
                    }}
                />
                <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    </>
}