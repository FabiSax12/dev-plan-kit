import { useState, useRef, useEffect } from "react"
import { Send, FileText, Eye, Pencil, Undo2, Copy, Download, Check, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useMutation } from "@tanstack/react-query"
import { updateRequirementsDocument } from "@/server-functions/projects"

const INITIAL_TEMPLATE = `# Requirements Document

## Project Overview
*Describe the project's purpose, goals, and vision here...*

## Stakeholders
- **Client**: 
- **End Users**: 
- **Development Team**: 

## Functional Requirements

### Core Features
1. 

### Secondary Features
1. 

## Non-Functional Requirements

### Performance
- 

### Security
- 

### Scalability
- 

## User Personas

## Constraints & Assumptions

## Success Criteria

## Open Questions
- 

---
*Last updated: ${new Date().toLocaleDateString()}*
`

const AI_MOCK_REPONSES = {
  USER_PERSONA: `

## User Personas

### Primary Persona: The Power User
- **Name**: Alex Chen
- **Role**: Project Manager
- **Goals**: Efficiently manage multiple projects, track progress
- **Pain Points**: Current tools are fragmented, lack visibility
- **Technical Proficiency**: High

### Secondary Persona: The Occasional User  
- **Name**: Sarah Johnson
- **Role**: Stakeholder / Executive
- **Goals**: Quick status updates, high-level overview
- **Pain Points**: Too much detail, wants summaries
- **Technical Proficiency**: Medium
`,

  RISKS: `

## Risks & Mitigation

| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|--------|---------------------|
| Scope creep | High | High | Strict change control process |
| Technical debt | Medium | High | Regular refactoring sprints |
| Resource availability | Medium | Medium | Cross-training team members |
| Third-party dependencies | Low | High | Evaluate alternatives, monitor updates |
| Security vulnerabilities | Medium | Critical | Regular security audits, penetration testing |
`,

  CRITERIA_SECTION: `

## Acceptance Criteria

### Feature: User Authentication
- [ ] Users can register with email and password
- [ ] Users receive email verification
- [ ] Users can log in with valid credentials
- [ ] Users see error message for invalid credentials
- [ ] Password reset flow works end-to-end
- [ ] Session expires after 24 hours of inactivity

### Feature: Dashboard
- [ ] Dashboard loads within 2 seconds
- [ ] All metrics display current data
- [ ] Charts are interactive and responsive
- [ ] Export functionality works for all data views
`,

  PRIORITY_SECTION: `

## Priority Matrix (MoSCoW)

### Must Have (P0)
- Core authentication system
- Main dashboard view
- Data persistence
- Basic reporting

### Should Have (P1)
- Advanced filtering
- Export functionality
- Email notifications
- User preferences

### Could Have (P2)
- Dark mode
- Mobile app
- API integrations
- Advanced analytics

### Won't Have (This Release)
- AI-powered insights
- Multi-language support
- Offline mode
`,

  TECH_SECTION: `

## Technical Requirements

### Architecture
- Microservices architecture with API gateway
- RESTful API design following OpenAPI 3.0 spec
- Event-driven communication for async operations

### Infrastructure
- Cloud-native deployment (AWS/GCP/Azure)
- Container orchestration with Kubernetes
- CI/CD pipeline with automated testing

### Data Requirements
- PostgreSQL for primary data store
- Redis for caching and sessions
- Data retention: 7 years for compliance

### Integration Points
- OAuth 2.0 / OIDC for authentication
- Webhook support for external systems
- API rate limiting: 1000 requests/minute
`


}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTED_PROMPTS = [
  "Add user personas section",
  "Generate acceptance criteria",
  "Identify potential risks",
  "Add priority matrix",
  "Expand technical requirements",
]

interface RequirementsEditorProps {
  projectId: string
  initialContent?: string
  contextName?: string
}

export function RequirementsEditor({ initialContent, contextName, projectId }: RequirementsEditorProps) {
  const [content, setContent] = useState(initialContent || INITIAL_TEMPLATE)
  const [history, setHistory] = useState<string[]>([initialContent || INITIAL_TEMPLATE])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("preview")
  const [canSave, setCanSave] = useState(false)

  // AI Chat state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `I'm here to help you build out the requirements document${contextName ? ` for **${contextName}**` : ""}. You can ask me to:\n\n- Add new sections (user personas, risks, constraints)\n- Expand on existing content\n- Generate acceptance criteria\n- Help organize and prioritize requirements\n\nJust describe what you need and I'll update the document.`,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)


  const modifyDocumentMutation = useMutation({
    mutationFn: async (content: string) => updateRequirementsDocument({
      data: {
        content,
        projectId
      }
    }),
    mutationKey: ['update-requirements-document'],
    onSuccess: () => {
      setCanSave(false);
    },
    onError: (error) => {
      console.error("Error updating requirements document:", error);
      alert("There was an error saving the document. Please try again.");
    },

  });


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const updateContent = (newContent: string) => {
    setContent(newContent)
    setCanSave(true)
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newContent)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
      setCanSave(true)
    }

    if (historyIndex - 1 === 0) {
      setCanSave(false)
    }
  }

  const handleSave = async () => {
    await modifyDocumentMutation.mutateAsync(content);
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExport = () => {
    const blob = new Blob([content], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `requirements-${contextName?.toLowerCase().replace(/\s+/g, "-") || "document"}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let newContent = content
      let response = ""

      if (input.toLowerCase().includes("persona")) {
        const personaSection = AI_MOCK_REPONSES.USER_PERSONA
        newContent = content.replace("## User Personas", personaSection)
        if (!content.includes("## User Personas")) {
          newContent = content + personaSection
        }
        response =
          "I've added detailed user personas to your document. I included a primary persona (power user) and a secondary persona (occasional user). Feel free to edit these based on your actual user research."
      } else if (input.toLowerCase().includes("risk")) {
        const riskSection = AI_MOCK_REPONSES.RISKS
        newContent = content.includes("## Risks")
          ? content.replace(/## Risks.*?(?=##|$)/s, riskSection)
          : content + riskSection
        response =
          "I've added a risk assessment table with probability, impact, and mitigation strategies. You should review and adjust these based on your project's specific context."
      } else if (input.toLowerCase().includes("acceptance") || input.toLowerCase().includes("criteria")) {
        const criteriaSection = AI_MOCK_REPONSES.CRITERIA_SECTION
        newContent = content.includes("## Acceptance Criteria")
          ? content.replace(/## Acceptance Criteria.*?(?=##|$)/s, criteriaSection)
          : content + criteriaSection
        response =
          "I've added acceptance criteria sections with checkable items. I included examples for authentication and dashboard features - replace these with your actual features."
      } else if (input.toLowerCase().includes("priority") || input.toLowerCase().includes("matrix")) {
        const prioritySection = AI_MOCK_REPONSES.PRIORITY_SECTION
        newContent = content.includes("## Priority")
          ? content.replace(/## Priority.*?(?=##|$)/s, prioritySection)
          : content + prioritySection
        response =
          "I've added a MoSCoW priority matrix to help categorize requirements. Adjust the items based on your stakeholder discussions and business value."
      } else if (input.toLowerCase().includes("technical") || input.toLowerCase().includes("expand")) {
        const techSection = AI_MOCK_REPONSES.TECH_SECTION
        newContent = content.includes("## Technical Requirements")
          ? content.replace(/## Technical Requirements.*?(?=##|$)/s, techSection)
          : content + techSection
        response =
          "I've expanded the technical requirements section with architecture, infrastructure, data, and integration details. Customize these based on your technology choices."
      } else {
        response = `I can help you with that! Here are some specific things I can add to your document:\n\n- **User Personas**: Detailed profiles of your target users\n- **Risk Assessment**: Table of risks with mitigation strategies\n- **Acceptance Criteria**: Checkable criteria for features\n- **Priority Matrix**: MoSCoW prioritization\n- **Technical Requirements**: Architecture and infrastructure details\n\nJust ask for any of these, or describe what you'd like me to add or modify.`
      }

      if (newContent !== content) {
        updateContent(newContent)
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-100px)] min-h-125">
      {/* Editor Section */}
      <div className="flex-1 flex flex-col border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "edit" | "preview")}>
            <TabsList className="h-8">
              <TabsTrigger value="preview" className="text-xs px-3">
                <Eye className="h-3 w-3 mr-1.5" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs px-3">
                <Pencil className="h-3 w-3 mr-1.5" />
                Edit
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" onClick={handleUndo} disabled={historyIndex === 0} className="h-8">
              <Undo2 className="h-3.5 w-3.5 mr-1" />
              Undo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              disabled={!canSave || modifyDocumentMutation.isPending}
              className="h-8"
            >
              {modifyDocumentMutation.isPending ? <>
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                Saving...
              </> : <>
                <Save className="h-3.5 w-3.5 mr-1" />
                Save
              </>}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8">
              {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport} className="h-8">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === "edit" ? (
            <Textarea
              value={content}
              onChange={(e) => updateContent(e.target.value)}
              className="h-full w-full resize-none border-0 rounded-none focus-visible:ring-0 font-mono text-sm p-4"
              placeholder="Write your requirements document..."
            />
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-4" {...props} />,
                    h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mb-3" {...props} />,
                    h3: ({ node, ...props }) => <h3 className="text-2xl font-bold mb-2" {...props} />,
                    h4: ({ node, ...props }) => <h4 className="text-xl font-bold mb-2" {...props} />,
                    p: ({ node, ...props }) => <p className="mb-4" {...props} />,
                    ul: ({ node, ...props }) => <ul className="list-disc ml-6 mb-4" {...props} />,
                    ol: ({ node, ...props }) => <ol className="list-decimal ml-6 mb-4" {...props} />,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* AI Chat Section */}
      <div className="w-full lg:w-96 flex flex-col border rounded-lg overflow-hidden hidden">
        <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/30">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium text-sm">AI Assistant</span>
        </div>

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
                  // className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

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
      </div>
    </div>
  )
}



