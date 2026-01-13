import { ProjectData } from "@/domain/Project";

import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getProjects = createServerFn({method: 'GET'})
.handler(async (): Promise<ProjectData[]> => {
  const supabase = getSupabaseServerClient();

  const user = await supabase.auth.getUser();

  console.log('User fetch result:', user);

  if (user.error || !user.data.user) {
    console.error('Error fetching user:', user.error);
    return [];
  }

  const projectsQuery = await supabase.from('projects').select('*');

  console.log('Projects query:', projectsQuery);

  if (projectsQuery.error) {
    console.error('Error fetching projects:', projectsQuery.error);
    return [];
  }

  return projectsQuery.data;
});

export const getProjectById = createServerFn({
  method: "GET"
}).inputValidator(z.object({
  id: z.string(),
})).handler(async ({data}): Promise<ProjectData> => {
  const supabase = getSupabaseServerClient();

  const projectQuery = await supabase.from('projects').select('*').eq('id', data.id).single();

  if (projectQuery.error) {
    console.error('Error fetching project by ID:', projectQuery.error);
    throw new Error('Project not found');
  }

  return projectQuery.data;
});

export const createProjectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  project_type: z.enum(['personal', 'work']).optional(),
  status: z.enum(['planning', 'in_development', 'completed', 'on_hold']).optional(),
  production_url: z.string().optional(),
  repository_url: z.string().optional(),
  tech_stack: z.array(z.string()).optional(),
  user_id: z.string(),
});

export const createProject = createServerFn({
  method: "POST"
})
  .inputValidator(createProjectSchema)
  .handler(async ({data}): Promise<void> => {

    console.log('Creating project payload:', data);

    const supabase = getSupabaseServerClient();

    const createProjectQuery = await supabase.from('projects').insert({
      name: data.name,
      description: data.description,
      project_type: data.project_type || 'personal',
      status: data.status,
      production_url: data.production_url,
      repository_url: data.repository_url,
      tech_stack: data.tech_stack,
      user_id: data.user_id,
    });

    if (createProjectQuery.error) {
      console.error('Error creating project:', createProjectQuery.error);
      throw new Error('Failed to create project');
    }
  });

export const deleteProject = createServerFn({
  method: "POST"
}).inputValidator(z.object({
  id: z.string(),
})).handler(async ({data}): Promise<void> => {
  const supabase = getSupabaseServerClient();
  const deleteProjectQuery = await supabase.from('projects').delete().eq('id', data.id);

  if (deleteProjectQuery.error) {
    console.error('Error deleting project:', deleteProjectQuery.error);
    throw new Error('Failed to delete project');
  }

});

export const updateProjectSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  project_type: z.enum(['personal', 'work']).optional(),
  status: z.enum(['planning', 'in_development', 'completed', 'on_hold']).optional(),
  production_url: z.string().optional().nullable(),
  repository_url: z.string().optional().nullable(),
  tech_stack: z.array(z.string()).optional(),
  user_id: z.string(),
});

export const updateProject = createServerFn({
  method: "POST"
})
  .inputValidator(updateProjectSchema)
  .handler(async ({data}): Promise<void> => {
    const supabase = getSupabaseServerClient();

    console.log('Updating project payload:', data);

    const updateProjectQuery = await supabase.from('projects').update({
      name: data.name,
      description: data.description,
      project_type: data.project_type,
      status: data.status,
      production_url: data.production_url,
      repository_url: data.repository_url,
      tech_stack: data.tech_stack,
    }).eq('id', data.id);

    if (updateProjectQuery.error) {
      console.error('Error updating project:', updateProjectQuery.error);
      throw new Error('Failed to update project');
    }
  });