import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Project } from '@/domain/Project';
import { getProjectById } from '@/server-functions/projects';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router'
import { Calendar, ExternalLink, Github, Link } from 'lucide-react';

export const Route = createFileRoute('/_app/projects/$projectId/_layout/overview/')({
  component: RouteComponent,
  loader: async ({ params, context }) => {
    context.queryClient.ensureQueryData({
      queryKey: ['project', params.projectId],
      queryFn: () => getProjectById({ data: { id: params.projectId } }),
    });
  }
})

function RouteComponent() {

  const { data: projectData } = useSuspenseQuery({
    queryKey: ['project', Route.useParams().projectId],
    queryFn: () => getProjectById({ data: { id: Route.useParams().projectId } }),
  });

  const project = Project.fromJSONData(projectData);


  return <div className="grid xs:grid-cols-2 lg:grid-cols-4 gap-4 [view-transition-name:main-content]">
    {/* Links Card - spans 2 columns */}
    <Card className="col-span-1 sm:col-span-2 row-span-1 sm:row-span-2">
      <CardHeader className='flex items-center gap-2'>
        <Link className="h-4 w-4 text-muted-foreground" />
        <CardTitle className='font-medium'>Links</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-3">
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
                <span className='truncate'>
                  {project.getRepoUrl()?.replace(/^https?:\/\//, "")}
                </span>
              </a>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Not set</p>
            )}
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
                <span className='truncate'>
                  {project.getUrl()?.replace(/^https?:\/\//, "")}
                </span>
              </a>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">Not set</p>
            )}
          </div>
          {project.getExtraUrls().map((extraUrl) => (
            <div key={extraUrl.url}>
              <p className="text-sm text-muted-foreground">{extraUrl.name}</p>
              <a
                href={extraUrl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline mt-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span className='truncate'>
                  {extraUrl.url.replace(/^https?:\/\//, "")}
                </span>
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Created At Card */}
    <Card>
      <CardHeader className='flex items-center gap-2'>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <CardTitle className='text-sm text-muted-foreground'>Created</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{project.getCreatedAt().toDateString()}</p>
      </CardContent>
    </Card>

    {/* Updated At Card */}
    <Card>
      <CardHeader className='flex items-center gap-2'>
        <Calendar className="h-4 w-4 text-muted-foreground" />
        <CardTitle className='text-sm text-muted-foreground'>
          Updated
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{project.getUpdatedAt().toLocaleString()}</p>
      </CardContent>
    </Card>

    {/* Tech Stack Card - spans 2 columns */}
    {project.getTechStack().length > 0 && (
      <Card className="col-span-1 sm:col-span-2">
        <CardHeader>
          <CardTitle className='text-sm text-muted-foreground'>Tech Stack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {project.getTechStack().map((tech) => (
              <Badge key={tech} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    )}
  </div>
}
