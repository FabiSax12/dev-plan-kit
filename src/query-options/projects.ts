import { Project } from "@/domain/Project";
import { getProjectById, getProjects } from "@/server-functions/projects";
import { queryOptions } from "@tanstack/react-query";

export const createProjectsQueryOptions = () => queryOptions({
    queryKey: ['projects'],
    queryFn: getProjects,
    select: (projects) => projects.map(Project.fromJSONData),
})

export const createProjectByIdQueryOptions = (id: string | number) => queryOptions({
    queryKey: ['projects', id],
    queryFn: () => getProjectById({ data: { id: Number(id) } }),
    select: (project) => Project.fromJSONData(project),
})