import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github, Eye, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Project } from "@/domain/Project"
import { statusConfig, typeConfig } from "@/lib/themeConfig"

export function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.getStatus()]
  const type = typeConfig[project.getProjectType()]

  return (
    <Card className="group transition-shadow hover:shadow-md gap-0">
      <CardHeader>
        <CardTitle>{project.getName()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {/* <Link to={'/projects/$projectId'} params={{ projectId: project.getId() }} className="block">
              <h3 className="font-semibold truncate group-hover:text-primary transition-colors">{project.getName()}</h3>
              </Link> */}
            <CardDescription>{project.getDescription()}</CardDescription>
            {/* <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{project.getDescription()}</p> */}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className={status.className}>
            {status.label}
          </Badge>
          <Badge variant="secondary" className={type.className}>
            {type.label}
          </Badge>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-3">
            {project.getUrl() && (
              <a
                href={project.getUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Project URL</span>
              </a>
            )}
            {project.getRepoUrl() && (
              <a
                href={project.getRepoUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">Repository</span>
              </a>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Updated {Intl.DateTimeFormat().format(new Date(project.getUpdatedAt()))}</span>
        </div>


      </CardContent>
      <CardFooter className="flex justify-between items-center mt-3">
        {project.getTechStack().length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.getTechStack().slice(0, 3).map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs font-normal">
                {tech}
              </Badge>
            ))}
            {project.getTechStack().length > 3 && (
              <Badge variant="outline" className="text-xs font-normal">
                +{project.getTechStack().length - 3}
              </Badge>
            )}
          </div>
        )}
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={'/projects/$projectId'} params={{ projectId: project.getId() }}>
              <Eye className="h-4 w-4" />
              <span className="sr-only">View project</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to={'/projects/$projectId/edit'} params={{ projectId: project.getId() }}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit project</span>
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
