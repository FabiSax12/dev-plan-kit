import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import { Link } from "@tanstack/react-router"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronRight,
  Plus,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Project, type ProjectType, type ProjectStatus } from "@/domain/Project"
import { deleteProject, getProjectById } from '@/server-functions/projects'
import { RequirementsEditor } from '@/components/RequirementsEditor'

interface Epic {
  id: string
  name: string
  description: string
  stories: UserStory[]
}

interface UserStory {
  id: string
  title: string
  completed: boolean
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  completed: boolean
}

const mockEpics: Epic[] = [
  {
    id: "1",
    name: "User Authentication",
    description: "Implement secure user authentication with multiple providers",
    stories: [
      {
        id: "1-1",
        title: "As a user, I want to sign up with email and password",
        completed: true,
        tasks: [
          { id: "1-1-1", title: "Create signup form component", completed: true },
          { id: "1-1-2", title: "Implement form validation", completed: true },
          { id: "1-1-3", title: "Connect to auth API", completed: true },
        ],
      },
      {
        id: "1-2",
        title: "As a user, I want to log in to my account",
        completed: true,
        tasks: [
          { id: "1-2-1", title: "Create login form component", completed: true },
          { id: "1-2-2", title: "Implement session management", completed: true },
        ],
      },
      {
        id: "1-3",
        title: "As a user, I want to reset my password",
        completed: false,
        tasks: [
          { id: "1-3-1", title: "Create password reset form", completed: false },
          { id: "1-3-2", title: "Implement email sending", completed: false },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Product Catalog",
    description: "Build the product browsing and search functionality",
    stories: [
      {
        id: "2-1",
        title: "As a user, I want to browse products by category",
        completed: false,
        tasks: [
          { id: "2-1-1", title: "Create category navigation", completed: true },
          { id: "2-1-2", title: "Build product grid component", completed: false },
        ],
      },
      {
        id: "2-2",
        title: "As a user, I want to search for products",
        completed: false,
        tasks: [
          { id: "2-2-1", title: "Implement search API", completed: false },
          { id: "2-2-2", title: "Build search UI with filters", completed: false },
        ],
      },
    ],
  },
]

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  planning: { label: "Planning", className: "bg-blue-100 text-blue-700" },
  "in_development": { label: "In Development", className: "bg-amber-100 text-amber-700" },
  completed: { label: "Completed", className: "bg-emerald-100 text-emerald-700" },
  "on_hold": { label: "On Hold", className: "bg-gray-100 text-gray-700" },
}

export const Route = createFileRoute('/_app/projects/$projectId/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { projectId } = params;
    return getProjectById({ data: { id: projectId } });
  },
})

function EpicItem({ epic }: { epic: Epic }) {
  const [isOpen, setIsOpen] = useState(false)
  const completedStories = epic.stories.filter((s) => s.completed).length
  const progress = (completedStories / epic.stories.length) * 100

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              <div className="flex-1 text-left">
                <CardTitle className="text-base">{epic.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{epic.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {completedStories}/{epic.stories.length} stories
                </p>
                <Progress value={progress} className="w-24 h-2 mt-1" />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            {epic.stories.map((story) => (
              <StoryItem key={story.id} story={story} />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

function StoryItem({ story }: { story: UserStory }) {
  const [showTasks, setShowTasks] = useState(false)

  return (
    <div className="rounded-lg border p-3 space-y-2">
      <div className="flex items-start gap-3">
        <Checkbox checked={story.completed} className="mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm">{story.title}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowTasks(!showTasks)}>
          {showTasks ? "Hide" : "View"} Tasks
        </Button>
      </div>
      {showTasks && (
        <div className="ml-7 space-y-2 pt-2 border-t">
          {story.tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <Checkbox checked={task.completed} />
              <span className="text-sm text-muted-foreground">{task.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function RouteComponent() {
  const { projectId: id } = Route.useParams();
  const navigate = Route.useNavigate();

  const projectData = Route.useLoaderData();
  const project = new Project({
    id: projectData.id,
    name: projectData.name,
    description: projectData.description,
    status: projectData.status,
    projectType: projectData.project_type,
    url: projectData.production_url,
    repoUrl: projectData.repository_url,
    techStack: projectData.tech_stack || [],
    updatedAt: projectData.updated_at,
  });

  const [status, setStatus] = useState<ProjectStatus>(project.getStatus());

  const typeConfig: Record<ProjectType, { label: string; className: string }> = {
    personal: { label: "Personal", className: "bg-purple-100 text-purple-700" },
    work: { label: "Client Work", className: "bg-orange-100 text-orange-700" },
  }

  const handleDeleteProject = async () => {
    await deleteProject({ data: { id } });

    navigate({ to: '/projects' });
  };

  return (
    <div className="space-y-6">
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
            <p className="text-muted-foreground mt-1">{project.getDescription()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => setStatus(v as ProjectStatus)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="in-development">In Development</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
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
      {/* Project Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant="secondary" className={"mt-1 ${typeConfig[project.getType()].className}"}>
                {typeConfig[project.getProjectType()].label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant="secondary" className={"mt-1 ${statusConfig[status].className}"}>
                {statusConfig[status].label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Project URL</p>
              {project.getUrl() ? (
                <a
                  href={project.getUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  {project.getUrl()?.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Not set</p>
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Repository</p>
              {project.getRepoUrl() ? (
                <a
                  href={project.getRepoUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
                >
                  <Github className="h-3 w-3" />
                  View on GitHub
                </a>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Not set</p>
              )}
            </div>
          </div>
          {project.getTechStack().length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Tech Stack</p>
              <div className="flex flex-wrap gap-2">
                {project.getTechStack().map((tech) => (
                  <Badge key={tech} variant="outline">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Tabs */}
      <Tabs defaultValue="requirements" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="epics">Epics & Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This project was created to build a modern e-commerce solution. Track progress in the Epics & Stories
                tab.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-4">
          <RequirementsEditor contextName={project.getName()} />
        </TabsContent>

        <TabsContent value="epics" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Epics & User Stories</h2>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/ai-assistant`} search={{ project: project.getName() }}>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate from AI
                </Link>
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Epic
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {mockEpics.map((epic) => (
              <EpicItem key={epic.id} epic={epic} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
