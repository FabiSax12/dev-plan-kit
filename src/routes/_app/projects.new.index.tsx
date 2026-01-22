import { Button } from '@/components/ui/button'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { createProject } from '@/server-functions/projects'
import { ProjectForm, type ProjectFormValues } from '@/components/projects/ProjectForm'
import z from 'zod'
import { Project } from '@/domain/Project'

export const Route = createFileRoute('/_app/projects/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const userId = Route.useRouteContext().user?.id!

  const createProjectMutation = useMutation({
    mutationFn: async (newProjectData: z.infer<typeof Project._schemas.createProjectSchema>) =>
      await createProject({ data: newProjectData }),
  })

  const handleSubmit = async (values: ProjectFormValues) => {


    await createProjectMutation.mutateAsync({
      description: values.description.length > 0 ? values.description : undefined,
      name: values.name,
      projectType: values.project_type,
      status: values.status,
      productionUrl: values.production_url.length > 0 ? values.production_url : undefined,
      repositoryUrl: values.repository_url.length > 0 ? values.repository_url : undefined,
      techStack: values.tech_stack,
      extraUrls: values.extra_urls,
      userId: userId,
    })
    router.navigate({ to: '/projects' })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" className="w-fit" asChild>
        <Link to="/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <ProjectForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createProjectMutation.isPending}
      />

      {/* <ProjectForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={createProjectMutation.isPending}
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
          <ProjectForm.SubmitButton />
          <ProjectForm.CancelButton />
        </ProjectForm.Actions>
      </ProjectForm> */}
    </div>
  )
}
