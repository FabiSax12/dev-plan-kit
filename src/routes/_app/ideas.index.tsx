import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router"
import { Plus, Lightbulb, Sparkles, FolderKanban, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { deleteIdea, getIdeas } from '@/server-functions/ideas'
import { Idea } from '@/domain/Idea'

export const Route = createFileRoute('/_app/ideas/')({
  component: RouteComponent,
  loader: async () => ({
    ideasData: await getIdeas(),
  }),
})

export function RouteComponent() {
  const { ideasData } = Route.useLoaderData();

  const ideas = ideasData.map(Idea.fromJSONData);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">My Ideas</h1>
        <Button asChild>
          <Link to="/ideas/new">
            <Plus className="mr-2 h-4 w-4" />
            New Idea
          </Link>
        </Button>
      </div>

      {/* Ideas List */}
      {ideas.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ideas.map((idea) => (
            <Card key={idea.getId()} className="group">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                    <Lightbulb className="h-5 w-5 text-amber-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate">{idea.getTitle()}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{idea.getDescription()}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{idea.getCreatedAt().toLocaleString()}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link to={`/ai-assistant`} search={{ idea: idea.getId() }}>
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                      Chat with AI
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                    Convert to Project
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={async () => {
                      await deleteIdea({ data: { id: idea.getId() } });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <Lightbulb className="h-12 w-12 text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">No ideas yet</p>
          <Button variant="link" asChild className="mt-2">
            <Link to="/ideas/new">Capture your first idea</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
