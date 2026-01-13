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

export const Route = createFileRoute('/_app/dashboard')({
  component: RouteComponent,
  loader: async () => {
    const projectsData = await getProjects();

    return {
      projectsData,
    }
  }
})

export function RouteComponent() {
  const { projectsData } = Route.useLoaderData()
  
  const projects = projectsData.map(data => new Project({
    id: data.id,
    name: data.name,
    description: data.description,
    status: data.status,
    projectType: data.project_type,
    url: data.production_url,
    repoUrl: data.repository_url,
    techStack: data.tech_stack || [],
    updatedAt: data.updated_at,
  }))

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const activeProjects = projects.filter((p) => p.getStatus() === "in-development" || p.getStatus() === "planning")

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
        <div>
          <RecentIdeas />
        </div>
      </div>
    </div>
  )
}
