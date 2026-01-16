import { Button } from '@/components/ui/button'
import { Project } from '@/domain/Project'
import { getProjectById } from '@/server-functions/projects'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Sparkles, Plus } from 'lucide-react'
import { useState } from "react"
import {
  ChevronDown,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

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


export const Route = createFileRoute('/_app/projects/$projectId/_layout/epics/')({
  component: RouteComponent,
  loader: async ({ params }) => {

    const { projectId } = params
    const projectData = await getProjectById({ data: { id: projectId } })

    return {
      projectData,
      epicsData: mockEpics,
    }
  }
})

function RouteComponent() {

  const { projectData, epicsData } = Route.useLoaderData()

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

  return <div className='[view-transition-name:main-content]'>
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
      {epicsData.map((epic) => (
        <EpicItem key={epic.id} epic={epic} />
      ))}
    </div>
  </div>
}



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