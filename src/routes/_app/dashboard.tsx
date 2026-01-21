import { createFileRoute } from '@tanstack/react-router'
import { Link } from "@tanstack/react-router"
import { Plus, Lightbulb, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ProjectCard } from "@/components/dashboard/project-card"
import { RecentIdeas } from "@/components/dashboard/recent-ideas"
import { Suspense } from 'react'
import { getProjects } from '@/server-functions/projects'
import { Project } from '@/domain/Project'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { DefaultErrorComponent } from '@/components/error-components/DefaultErrorComponent'
import { DefaultPendingComponent } from '@/components/pending-components/DefaultPendingComponent'

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const projectsData = await getProjects();

    return {
      projectsData,
    }
  },
  errorComponent: ({ error, reset }) => <DefaultErrorComponent error={error} reset={reset} message='Failed to load dashboard data. Please try again later.' />,
  pendingComponent: DefaultPendingComponent,
})

export function RouteComponent() {
  const { projectsData } = Route.useLoaderData()

  const projects = projectsData.map(Project.fromJSONData);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const activeProjects = projects.filter((p) => p.getStatus() === "in_development" || p.getStatus() === "planning")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">{today}</p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/ideas/new">
            <Lightbulb className="mr-2 h-4 w-4" />
            New Idea
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/ai-assistant">
            <Sparkles className="mr-2 h-4 w-4" />
            Chat with AI
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsCards />
      </Suspense>

      {/* Active Projects & Recent Ideas */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Active Projects</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">View All</Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {activeProjects.slice(0, 4).map((project) => (
              <ProjectCard key={project.getId()} project={project} />
            ))}
          </div>
        </div>
        <div className='space-y-4'>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Ideas</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/ideas">View All</Link>
            </Button>
          </div>
          <RecentIdeas />
          <Card className='bg-linear-to-br from-primary/75 to-primary text-background'>
            <CardContent>
              <h1 className='font-semibold'>Stuck on an Idea?</h1>
              <p className='text-sm'>Let DevPlanKit AI help you brainstorm your next big project.</p>
            </CardContent>
            <CardFooter>
              <Button
                asChild
                className='w-full text-primary'
                variant="secondary"
              >
                <Link to="/ai-assistant">
                  <Sparkles />
                  Start AI Session
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
