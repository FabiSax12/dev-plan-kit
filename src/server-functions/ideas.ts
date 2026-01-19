import { Idea, IdeaData } from "@/domain/Idea";
import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

// Queris
export const getIdeas = createServerFn({
    method: 'GET'
}).handler(async (): Promise<IdeaData[]> => {
    const supabase = getSupabaseServerClient();

    const response = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

    if (response.error) {
        console.error('Error fetching ideas:', response.error);
        return [];
    }

    return response.data as IdeaData[];
});

export const getIdeaById = createServerFn({
    method: "GET"
}).inputValidator(z.object({
    id: z.string(),
})).handler(async ({ data }): Promise<IdeaData | null> => {
    const supabase = getSupabaseServerClient();

    const response = await supabase
        .from('ideas')
        .select('*')
        .eq('id', data.id)
        .single();

    if (response.error) {
        console.error('Error fetching idea by ID:', response.error);
        return null;
    }

    return response.data as IdeaData | null;
});

// Mutations
export const createIdea = createServerFn({
    method: 'POST'
})
    .inputValidator(Idea._schemas.createIdeaSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient();
        const response = await supabase.from('ideas').insert(data);

        if (response.error) {
            console.error('Error creating idea:', response.error);
        }
    });

export const updateIdea = createServerFn({
    method: 'POST'
})
    .inputValidator(z.object({
        id: z.string(),
        idea: Idea._schemas.updateIdeaSchema
    }))
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient();
        await supabase.from('ideas').update(data.idea).eq('id', data.id);
    });

export const deleteIdea = createServerFn({
    method: 'POST'
})
    .inputValidator(z.object({
        id: z.string(),
    }))
    .handler(async ({ data }) => {
        console.log("Delete idea " + data.id)
        const supabase = getSupabaseServerClient();
        const response = await supabase.from('ideas').delete().eq('id', data.id);

        if (response.error) {
            console.error('Error deleting idea:', response.error);
        }
    });