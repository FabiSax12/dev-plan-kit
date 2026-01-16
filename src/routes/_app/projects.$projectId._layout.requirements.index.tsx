import { RequirementsEditor } from '@/components/RequirementsEditor'
import { Project } from '@/domain/Project';
import { getRequirementsDocument, getProjectById } from '@/server-functions/projects';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/projects/$projectId/_layout/requirements/')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { projectId } = params;

    const requirementsDocumentPromise = getRequirementsDocument({ data: { projectId } });
    const projectPromise = getProjectById({ data: { id: projectId } });

    const [
      requirementsDocumentResult,
      projectResult
    ] = await Promise.all([
      requirementsDocumentPromise,
      projectPromise,
    ]);

    return {
      projectData: projectResult,
      requirementsMarkdown: requirementsDocumentResult || "# Project Requirements\n\nStart writing your project requirements here...",
    }
  }
})

function RouteComponent() {

  const { projectData, requirementsMarkdown } = Route.useLoaderData();

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
  });

  return <div className='[view-transition-name:main-content]'>
    <RequirementsEditor contextName={project.getName()} initialContent={requirementsMarkdown} />
  </div>
}
