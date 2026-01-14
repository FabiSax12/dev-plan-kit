import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { getProjectById, updateProject, updateProjectSchema } from '@/server-functions/projects'
import { ProjectForm, type ProjectFormValues } from '@/components/projects/ProjectForm'
import { Project } from '@/domain/Project'
import z from 'zod'

export const Route = createFileRoute('/_app/projects/$projectId/edit/')({
  component: RouteComponent,
  loader: async (route) => {
    const { projectId } = route.params
    const projectData = await getProjectById({
      data: { id: projectId },
    })
    return { projectData }
  },
})

function RouteComponent() {
  const router = useRouter()
  const userId = Route.useRouteContext().user?.id!
  const { projectId } = Route.useParams()
  const { projectData } = Route.useLoaderData()

  const project = new Project({
    id: projectData.id,
    name: projectData.name,
    description: projectData.description,
    projectType: projectData.project_type,
    status: projectData.status,
    url: projectData.production_url,
    repoUrl: projectData.repository_url,
    techStack: projectData.tech_stack ?? [],
    updatedAt: projectData.updated_at,
  })

  const editProjectMutation = useMutation({
    mutationFn: async (data: z.infer<typeof updateProjectSchema>) =>
      await updateProject({ data }),
  })

  const handleSubmit = async (values: ProjectFormValues) => {
    console.log('Submitting edited project:', values)
    await editProjectMutation.mutateAsync({ ...values, user_id: userId, id: projectId })
    router.navigate({ to: '/projects' })
  }

  const initialData = {
    name: project.getName(),
    description: project.getDescription(),
    project_type: project.getProjectType(),
    status: project.getStatus(),
    production_url: project.getUrl(),
    repository_url: project.getRepoUrl(),
    tech_stack: project.getTechStack(),
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link to="/projects/$projectId" params={{ projectId }}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Project
        </Link>
      </Button>

      <ProjectForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={editProjectMutation.isPending}
      />

      {/* <ProjectForm
        mode="edit"
        initialData={initialData}
        onSubmit={handleSubmit}
        isSubmitting={editProjectMutation.isPending}
      >
        <ProjectForm.Header />
        <ProjectForm.NameField />
        <ProjectForm.DescriptionField />
        <ProjectForm.ProjectTypeField />
        <ProjectForm.StatusField />
        <ProjectForm.UrlField />
        <ProjectForm.RepositoryField />
        <ProjectForm.TechStackField />

        <ProjectForm.Actions>
          <ProjectForm.SubmitButton>Save Changes</ProjectForm.SubmitButton>
          <ProjectForm.CancelButton />
        </ProjectForm.Actions>
      </ProjectForm> */}
    </div>
  )
}
