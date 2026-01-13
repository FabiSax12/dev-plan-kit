import { ProjectsList } from '@/components/ProjectsList'
import { Button } from '@/components/ui/button'
import { Project } from '@/domain/Project'
import { getProjects } from '@/server-functions/projects'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'

export const Route = createFileRoute('/_app/projects/')({
  component: RouteComponent,
  loader: () => getProjects(),
})

function RouteComponent() {
  const projectsData = Route.useLoaderData();
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">My Projects</h1>
        <Button asChild>
          <Link to="/projects/new">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Link>
        </Button>
      </div>

      <ProjectsList projects={projects} />
    </div>
  )
}
