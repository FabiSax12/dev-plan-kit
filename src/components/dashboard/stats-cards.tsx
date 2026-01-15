import { Card, CardContent } from "@/components/ui/card"
import { getIdeas } from "@/server-functions/ideas";
import { getProjects } from "@/server-functions/projects"
import { useQueries } from "@tanstack/react-query"
import { FolderKanban, CheckCircle2, Lightbulb } from "lucide-react"

export function StatsCards() {

  const [projectsQuery, ideasQuery] = useQueries({
    queries: [
      {
        queryKey: ['projects'],
        queryFn: () => getProjects(),
        initialData: () => [],
        placeholderData: () => []
      },
      {
        queryKey: ['ideas'],
        queryFn: () => getIdeas(),
        initialData: () => [],
        placeholderData: () => []
      }
    ]
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10`}>
            <FolderKanban className={`h-6 w-6 text-primary`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{projectsQuery.data.length}</p>
              {/* {stat.subtitle && <span className="text-sm text-muted-foreground">{stat.subtitle}</span>} */}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100`}>
            <CheckCircle2 className={`h-6 w-6 text-emerald-600`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{projectsQuery.data.filter(p => p.status === 'completed').length}</p>
              <span className="text-sm text-muted-foreground">{(projectsQuery.data.filter(p => p.status === 'completed').length / projectsQuery.data.length * 100).toFixed(0)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100`}>
            <Lightbulb className={`h-6 w-6 text-amber-600`} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Ideas</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-semibold">{ideasQuery.data.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* {stats.map((stat) => (
        <Card key={stat.title}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{stat.value}</p>
                {stat.subtitle && <span className="text-sm text-muted-foreground">{stat.subtitle}</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      ))} */}
    </div>
  )
}
