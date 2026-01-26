import { createFileRoute, Link } from '@tanstack/react-router'
import z from 'zod'
import { createProjectsQueryOptions } from '@/query-options/projects'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { Project } from '@/domain/Project'
import { Badge } from '@/components/ui/badge'
import { FolderCode, Lightbulb } from 'lucide-react'
import { Idea } from '@/domain/Idea'
import { createIdeasQueryOptions } from '@/query-options/idea'

export const Route = createFileRoute('/_app/ai-assistant/')({
  component: RouteComponent,
  validateSearch: z.object({
    idea: z.string().optional(),
    project: z.string().optional(),
  }),
  loader: async ({ context }) => {
    const projectData = await context.queryClient.ensureQueryData(createProjectsQueryOptions());
    const ideaData = await context.queryClient.ensureQueryData(createIdeasQueryOptions());

    return { projectData, ideaData };
  }
})

function RouteComponent() {
  const { projectData, ideaData } = Route.useLoaderData();

  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projectData.map(Project.fromJSONData));
  const [filteredIdeas, setFilteredIdeas] = useState<Idea[]>(ideaData.map(Idea.fromJSONData));
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    if (search === '') {
      setFilteredProjects(projectData.map(Project.fromJSONData));
      setFilteredIdeas(ideaData.map(Idea.fromJSONData));
      return;
    }

    const filtered = projectData
      .filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase())
      )
      .map(Project.fromJSONData);

    setFilteredProjects(filtered);
  }, [search])


  return (
    <div className='max-w-2xl mx-auto'>
      <Input placeholder="Search projects..." className='mb-4' value={search} onChange={(e) => setSearch(e.target.value)} />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

        {filteredProjects.map(project => (
          <Link key={project.getId()} to='/ai-assistant/project/$projectId' params={{ projectId: project.getId().toString() }}>
            <Card className="group transition-shadow hover:shadow-md gap-0 h-full">
              <CardHeader className='flex items-center justify-between'>
                <CardTitle>{project.getName()}</CardTitle>
                <Badge variant={'default'}>
                  <FolderCode size={22} />
                  Project
                </Badge>
              </CardHeader>
              <CardContent className='flex-1'>
                <CardDescription>
                  {project.getDescription() || 'No description provided.'}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <span className='text-xs text-muted-foreground'>{formatDate(project.getUpdatedAt())}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}

        {filteredIdeas.map(idea => (
          <Link key={idea.getId()} to='/ai-assistant/idea/$ideaId' params={{ ideaId: idea.getId().toString() }}>
            <Card className="group transition-shadow hover:shadow-md gap-0 h-full max-h-44">
              <CardHeader className='flex items-center justify-between'>
                <CardTitle>{idea.getTitle()}</CardTitle>
                <Badge variant={'default'} className='bg-amber-300 text-accent-foreground dark:bg-amber-300-600 dark:text-background'>
                  <Lightbulb size={22} />
                  Idea
                </Badge>
              </CardHeader>
              <CardContent className='flex-1'>
                <CardDescription className='truncate'>
                  {idea.getDescription() || 'No description provided.'}
                </CardDescription>
              </CardContent>
              <CardFooter>
                <span className='text-xs text-muted-foreground'>{formatDate(idea.getCreatedAt())}</span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
