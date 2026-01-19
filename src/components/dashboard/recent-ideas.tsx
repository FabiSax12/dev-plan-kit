import { Link } from "@tanstack/react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import { useSuspenseQuery } from "@tanstack/react-query"
import { supabase } from "@/lib/supabase.client"
import { Idea } from "@/domain/Idea"
import { calcTimeAgo } from "@/lib/utils"

export function RecentIdeas() {

  const recentIdeasQuery = useSuspenseQuery({
    queryKey: ['ideas', 'recent'],
    queryFn: async (): Promise<Idea[]> => {
      const ideas = await supabase.from('ideas')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      return ideas.data?.map(Idea.fromJSONData) || [];
    }
  })

  return (
    <Card>
      <CardContent className="space-y-3">
        {recentIdeasQuery.data.map((idea) => (
          <Link
            key={idea.getId()}
            to={'/ideas/$ideaId'}
            params={{ ideaId: idea.getId() }}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
              <Lightbulb className="h-4 w-4 text-amber-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{idea.getTitle()}</p>
              <p className="text-xs text-muted-foreground">
                {calcTimeAgo(idea.getCreatedAt())}
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
