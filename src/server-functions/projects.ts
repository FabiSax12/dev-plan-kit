import { Project, ProjectData } from "@/domain/Project";

import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getProjects = createServerFn({ method: 'GET' })
  .handler(async (): Promise<ProjectData[]> => {
    const supabase = getSupabaseServerClient();

    const projectsQuery = await supabase.from('projects').select('*').order('updated_at', { ascending: false });

    if (projectsQuery.error) {
      console.error('Error fetching projects:', projectsQuery.error);
      return [];
    }

    return projectsQuery.data;
  });

export const getProjectById = createServerFn({
  method: "GET"
}).inputValidator(z.object({
  id: Project._schemas.plainProjectSchema.shape.id,
})).handler(async ({ data }): Promise<ProjectData> => {
  const supabase = getSupabaseServerClient();

  const projectQuery = await supabase.from('projects').select('*').eq('id', data.id).single();

  if (projectQuery.error) {
    console.error('Error fetching project by ID:', projectQuery.error);
    throw new Error('Project not found');
  }

  return projectQuery.data;
});

export const createProject = createServerFn({
  method: "POST"
})
  .inputValidator(Project._schemas.createProjectSchema)
  .handler(async ({ data }): Promise<void> => {

    const supabase = getSupabaseServerClient();

    const createProjectQuery = await supabase.from('projects').insert({
      name: data.name,
      description: data.description,
      project_type: data.projectType || 'personal',
      status: data.status,
      production_url: data.productionUrl,
      repository_url: data.repositoryUrl,
      tech_stack: data.techStack,
      user_id: data.userId,
      extra_urls: data.extraUrls,
    }).select("id");

    if (createProjectQuery.error) {
      console.error('Error creating project:', createProjectQuery.error);
      throw new Error('Failed to create project');
    }
  });

export const deleteProject = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: Project._schemas.plainProjectSchema.shape.id,
})).handler(async ({ data }): Promise<void> => {
  const supabase = getSupabaseServerClient();
  console.log("Deleting project " + data.id)
  const deleteProjectQuery = await supabase.from('projects').delete().eq('id', data.id);

  if (deleteProjectQuery.error) {
    console.error('Error deleting project:', deleteProjectQuery.error);
    throw new Error('Failed to delete project');
  }

});

export const updateProject = createServerFn({
  method: "POST"
})
  .inputValidator(Project._schemas.updateProjectSchema)
  .handler(async ({ data }): Promise<void> => {
    const supabase = getSupabaseServerClient();

    const updateProjectQuery = await supabase.from('projects').update({
      name: data.name,
      description: data.description,
      project_type: data.projectType,
      status: data.status,
      production_url: data.productionUrl,
      repository_url: data.repositoryUrl,
      tech_stack: data.techStack,
      extra_urls: data.extraUrls,
    }).eq('id', data.id);

    if (updateProjectQuery.error) {
      console.error('Error updating project:', updateProjectQuery.error);
      throw new Error('Failed to update project');
    }
  });

export const getRequirementsDocument = createServerFn({
  method: "GET"
}).inputValidator(z.object({
  projectId: Project._schemas.plainProjectSchema.shape.id,
})).handler(async ({ data }): Promise<string | null> => {
  const supabase = getSupabaseServerClient();

  const { data: fileData, error } = await supabase.storage
    .from('project-requirements-markdowns')
    .download(`${data.projectId}.md`);

  if (error) {
    console.error('Error downloading requirements document:', error);
    return null;
  }

  const text = await fileData.text();
  return text;
});

export const uploadRequirementsDocument = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  projectId: Project._schemas.plainProjectSchema.shape.id,
  content: z.string(),
})).handler(async ({ data }): Promise<void> => {
  const supabase = getSupabaseServerClient();

  const { error } = await supabase.storage
    .from('project-requirements-markdowns')
    .upload(`${data.projectId}.md`, data.content, { upsert: true });

  if (error) {
    console.error('Error uploading requirements document:', error);
    throw new Error('Failed to upload requirements document');
  }
});

export const updateRequirementsDocument = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  projectId: Project._schemas.plainProjectSchema.shape.id,
  content: z.string(),
})).handler(async ({ data }): Promise<void> => {
  const supabase = getSupabaseServerClient();

  console.log(`Updating file ${data.projectId}.md`);

  const { error } = await supabase.storage
    .from('project-requirements-markdowns')
    .update(`${data.projectId}.md`, data.content, {
      upsert: true,
      contentType: 'text/markdown',
    });

  if (error) {
    console.error('Error uploading requirements document:', error);
    throw new Error('Failed to upload requirements document');
  }
});