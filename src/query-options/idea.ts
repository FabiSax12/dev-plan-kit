import { Idea } from "@/domain/Idea";
import { getIdeaById, getIdeas } from "@/server-functions/ideas";
import { queryOptions } from "@tanstack/react-query";

export const createIdeasQueryOptions = () => queryOptions({
    queryKey: ['ideas'],
    queryFn: getIdeas,
    select: (ideas) => ideas.map(Idea.fromJSONData),
})

export const createIdeaByIdQueryOptions = (id: string | number) => queryOptions({
    queryKey: ['ideas', id],
    queryFn: () => getIdeaById({ data: { id: id.toString() } }),
    select: (idea) => idea ? Idea.fromJSONData(idea) : null,
})