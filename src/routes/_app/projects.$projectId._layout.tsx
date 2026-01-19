import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router'
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  Pencil,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Project, type ProjectType, type ProjectStatus } from "@/domain/Project"
import { deleteProject, getProjectById } from '@/server-functions/projects'

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-blue-100 text-blue-700" },
  "in_development": { label: "In Development", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
  "on_hold": { label: "On Hold", className: "bg-gray-100 text-gray-700" },
}

export const Route = createFileRoute('/_app/projects/$projectId/_layout')({
  component: RouteComponent,
  beforeLoad: ({ location, params }) => {
    if (location.pathname === `/projects/${params.projectId}` ||
      location.pathname === `/projects/${params.projectId}/`) {
      throw redirect({
        to: '/projects/$projectId/overview',
        params: { projectId: params.projectId }
      })
    }
  },
  loader: async ({ params }) => {
    const { projectId } = params;

    const projectResult = await getProjectById({ data: { id: projectId } });

    return {
      projectData: projectResult
    }
  }
})

function RouteComponent() {
  const { projectId: id } = Route.useParams();
  const navigate = Route.useNavigate();
  const location = useLocation();

  const {
    projectData
  } = Route.useLoaderData();

  const project = Project.fromJSONData(projectData);

  const [status, setStatus] = useState<ProjectStatus>(project.getStatus());

  const typeConfig: Record<ProjectType, { label: string; className: string }> = {
    personal: { label: "Personal", className: "bg-purple-100 text-purple-700" },
    work: { label: "Client Work", className: "bg-orange-100 text-orange-700" },
  }

  const handleDeleteProject = async () => {
    await deleteProject({ data: { id } });

    navigate({ to: '/projects' });
  };

  const getTransitionTypes = (targetRoute: string) => {
    if (location.pathname.includes('overview')) {
      return targetRoute.includes('requirements') || targetRoute.includes('epics')
        ? ['slide-left']
        : [];
    }
    if (location.pathname.includes('requirements')) {
      return targetRoute.includes('overview')
        ? ['slide-right']
        : targetRoute.includes('epics')
          ? ['slide-left']
          : [];
    }
    if (location.pathname.includes('epics')) {
      return targetRoute.includes('overview') || targetRoute.includes('requirements')
        ? ['slide-right']
        : [];
    }
    return [];
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link to="/projects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{project.getName()}</h1>
            <div className='flex gap-2'>
              <Badge variant="secondary" className={"mt-1 " + typeConfig[project.getProjectType()].className}>
                {typeConfig[project.getProjectType()].label}
              </Badge>
              <Badge variant="secondary" className={"mt-1 " + statusConfig[project.getStatus()].className}>
                {statusConfig[project.getStatus()].label}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">{project.getDescription()}</p>
          </div>

          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in_development">In Development</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" asChild>
              <Link to={`/projects/$projectId/edit`} params={{ projectId: id }}>
                <Pencil className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="icon" className="text-destructive bg-transparent" onClick={handleDeleteProject}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>



      </div>

      <div className='border-b'>
        <Link
          to="/projects/$projectId/overview"
          params={{ projectId: id }}
          className='px-4 py-2 inline-block transition-colors'
          activeProps={{
            className: "border-b-2 border-primary text-primary",
          }}
          viewTransition={{
            types: getTransitionTypes('overview')
          }}
        >
          Overview
        </Link>
        <Link
          to="/projects/$projectId/requirements"
          params={{ projectId: id }}
          className='px-4 py-2 inline-block transition-colors'
          activeProps={{
            className: "border-b-2 border-primary text-primary",
          }}
          viewTransition={{
            types: getTransitionTypes('requirements')
          }}
        >
          Requirements
        </Link>
        <Link
          to="/projects/$projectId/epics"
          params={{ projectId: id }}
          className='px-4 py-2 inline-block transition-colors'
          activeProps={{
            className: "border-b-2 border-primary text-primary",
          }}
          viewTransition={{
            types: getTransitionTypes('epics')
          }}
        >
          Epics & Stories
        </Link>
      </div>

      <Outlet />
    </div>
  )
}
