import { createFileRoute } from '@tanstack/react-router'
import { useChat } from '@ai-sdk/react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Bot, User } from 'lucide-react'
import z from 'zod'
import { DefaultChatTransport } from 'ai'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { AIChatInputBox, AIChatSuggestionBadge } from '@/components/chat/AIChatInputBox'

export const Route = createFileRoute('/_app/ai-assistant')({
  component: RouteComponent,
  validateSearch: z.object({
    idea: z.string().optional(),
    project: z.string().optional(),
  }),
})

function RouteComponent() {
  // const { idea, project } = Route.useSearch()

  // const initialMessage = idea
  //   ? `I have an idea I'd like to discuss: "${idea}". Can you help me refine it and suggest next steps?`
  //   : project
  //     ? `I'm working on a project called "${project}". Can you help me plan the development tasks?`
  //     : undefined

  const { messages, sendMessage, status, } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
    // initialMessages: initialMessage
    //   ? [{ id: '1', role: 'user', content: initialMessage }]
    //   : [],
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      sendMessage({ text: message });
      form.reset();
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col gap-4">
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <Bot className="size-5" />
            AI Assistant
          </CardTitle>
        </CardHeader> */}
        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
          <ScrollArea className="flex-1 p-4 overflow-y-scroll">
            <div className="flex flex-col gap-4">
              {messages.length === 0 && (
                <div className="text-muted-foreground flex flex-col items-center justify-center py-12 text-center">
                  <Bot className="text-muted-foreground/50 mb-4 size-12" />
                  <p className="text-lg font-medium">How can I help you today?</p>
                  <p className="text-sm">
                    Ask me about project ideas, tech stacks, or development planning.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                      }`}
                  >
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 list-decimal pl-4">{children}</ol>,
                        li: ({ children }) => <li className="mb-1">{children}</li>,
                        code: ({ children }) => (
                          <code className="bg-background/20 rounded px-1 py-0.5 text-sm">
                            {children}
                          </code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-background/20 my-2 overflow-x-auto rounded p-2">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {message.parts
                        .filter((part) => part.type === 'text')
                        .map((part) => part.text)
                        .join('\n')
                      }
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {status === 'submitted' && (
                <div className="flex gap-3">
                  <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full">
                    <Bot className="size-4" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>


          <AIChatInputBox
            onSubmit={handleSubmit}
            placeholder="Ask about your project ideas..."
            disabled={status === 'submitted' || status === 'streaming'}
            name="message"
            suggestionCards={(setPrompt) => {

              if (messages.length > 0) return null;

              return <>
                <AIChatSuggestionBadge
                  onClick={() => setPrompt("Generate a project plan for a mobile app")}
                >
                  Generate a project plan for a mobile app
                </AIChatSuggestionBadge>
                <AIChatSuggestionBadge
                  onClick={() => setPrompt("Outline the key features of a task management tool")}
                >
                  Outline the key features of a task management tool
                </AIChatSuggestionBadge>
                <AIChatSuggestionBadge
                  onClick={() => setPrompt("Suggest marketing strategies for a new SaaS product")}
                >
                  Suggest marketing strategies for a new SaaS product
                </AIChatSuggestionBadge>
                <AIChatSuggestionBadge
                  onClick={() => setPrompt(`Too long prompt? Try to be more concise. Too long prompt? Try to be more concise. Too long prompt? Try to be more concise.
                    Too long prompt? Try to be more concise. Too long prompt? Try to be more concise. Too long prompt? Try to be more concise.`)}
                >
                  Too long prompt? Try to be more concise. Too long prompt? Try to be more concise. Too long prompt? Try to be more concise.
                  Too long prompt? Try to be more concise. Too long prompt? Try to be more concise. Too long prompt? Try to be more concise.
                </AIChatSuggestionBadge>
              </>

            }}
          />

          {/* <form
            onSubmit={handleSubmit}
            className="flex gap-2 border-t p-4"
          >
            <Input
              placeholder="Ask about your project ideas..."
              disabled={status === 'submitted' || status === 'streaming'}
              className="flex-1"
              name="message"
              minLength={1}
            />
            <Button type="submit" disabled={status === 'submitted' || status === 'streaming'}>
              <Send className="size-4" />
            </Button>
          </form> */}
        </div>
      </div>
    </div>
  )
}
