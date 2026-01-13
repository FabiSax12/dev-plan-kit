import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Idea {
  id: string
  name: string
  createdAt: string
}

const recentIdeas: Idea[] = [
  { id: "1", name: "Mobile-first task tracker", createdAt: "2 days ago" },
  { id: "2", name: "AI code review tool", createdAt: "4 days ago" },
  { id: "3", name: "Open source analytics dashboard", createdAt: "1 week ago" },
]

export function RecentIdeas() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-semibold">Recent Ideas</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
          <Link to="/ideas">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {recentIdeas.map((idea) => (
          <Link
            key={idea.id}
            to={'/ideas/$ideaId'}
            params={{ ideaId: idea.id }}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{idea.name}</p>
              <p className="text-xs text-muted-foreground">{idea.createdAt}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
