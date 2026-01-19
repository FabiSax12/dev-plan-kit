import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router"
import { Plus, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getIdeas } from '@/server-functions/ideas'
import { Idea } from '@/domain/Idea'
import { IdeaCard } from '@/components/ideas/IdeaCard'

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
          {ideas.map((idea) => <IdeaCard key={idea.getId()} idea={idea} />)}
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
