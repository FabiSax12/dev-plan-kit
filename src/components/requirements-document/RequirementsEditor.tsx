import { useState } from "react"
import { Eye, Pencil, Undo2, Copy, Download, Check, Loader2, Save, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useMutation } from "@tanstack/react-query"
import { updateRequirementsDocument } from "@/server-functions/projects"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable"
import { usePanelRef } from "react-resizable-panels"
import { AIChat } from "./AIChat"

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

interface RequirementsEditorProps {
  projectId: string | number
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
  const [isAIChatCollapsed, setIsAIChatCollapsed] = useState(false);

  const chatPanelRef = usePanelRef();

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

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }, [messages])

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

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="w-full min-h-96"
    >
      {/* Editor Section */}
      <ResizablePanel defaultSize="65%" minSize="50%" className="flex-1 flex flex-col border border-r-0 rounded-l-lg overflow-hidden w-full">
        <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/30 pr-2">
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
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* AI Chat Section */}
      <ResizablePanel
        defaultSize="35%"
        minSize="35%"
        className="rounded-r-lg border border-l-0"
        panelRef={chatPanelRef}
        collapsible
        collapsedSize={48}
        onResize={() => setIsAIChatCollapsed(chatPanelRef.current?.isCollapsed() || false)}
      >
        {/* Header with collapse trigger */}
        <div className="flex items-center gap-2 border-b px-3 py-3 bg-muted/30">
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => {
            if (isAIChatCollapsed) return chatPanelRef.current?.expand()
            return chatPanelRef.current?.collapse()
          }}>
            {isAIChatCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
          {!isAIChatCollapsed && (
            <>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-sm">AI Assistant</span>
            </>
          )}
        </div>
        <AIChat
          hidden={isAIChatCollapsed}
          content={content}
          updateContent={updateContent}
        />
      </ResizablePanel>
    </ResizablePanelGroup >
  )
}
