import {
    LearningRoadmap,
    LearningRoadmapData,
    LearningPhase,
    LearningPhaseData,
    LearningItem,
    LearningItemData
} from "@/domain/LearningRoadmap";
import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

// ============================================
// Roadmap Server Functions
// ============================================

export const getRoadmaps = createServerFn({ method: 'GET' })
    .handler(async (): Promise<LearningRoadmapData[]> => {
        const supabase = getSupabaseServerClient();

        const { data, error } = await supabase
            .from('learning_roadmaps')
            .select('*')
        // .order('updated_at', { ascending: false });

        if (error) {
            console.error('Error fetching roadmaps:', error);
            return [];
        }

        return data;
    });

export const getRoadmapById = createServerFn({ method: 'GET' })
    .inputValidator(z.object({
        id: z.coerce.number().int(),
    }))
    .handler(async ({ data }): Promise<{
        roadmap: LearningRoadmapData;
        phases: LearningPhaseData[];
        items: LearningItemData[];
    }> => {
        const supabase = getSupabaseServerClient();

        // Fetch roadmap
        const { data: roadmap, error: roadmapError } = await supabase
            .from('learning_roadmaps')
            .select('*')
            .eq('id', data.id)
            .single();

        if (roadmapError) {
            console.error('Error fetching roadmap:', roadmapError);
            throw new Error('Roadmap not found');
        }

        // Fetch phases
        const { data: phases, error: phasesError } = await supabase
            .from('learning_phases')
            .select('*')
            .eq('roadmap_id', data.id)
            .order('order_index', { ascending: true });

        if (phasesError) {
            console.error('Error fetching phases:', phasesError);
            throw new Error('Failed to fetch phases');
        }

        // Fetch all items for all phases
        const phaseIds = (phases || []).map(p => p.id);
        let items: LearningItemData[] = [];

        if (phaseIds.length > 0) {
            const { data: itemsData, error: itemsError } = await supabase
                .from('learning_items')
                .select('*')
                .in('phase_id', phaseIds)
                .order('order_index', { ascending: true });

            if (itemsError) {
                console.error('Error fetching items:', itemsError);
                throw new Error('Failed to fetch items');
            }

            items = itemsData || [];
        }

        return { roadmap, phases: phases || [], items };
    });

export const createRoadmap = createServerFn({ method: 'POST' })
    .inputValidator(LearningRoadmap._schemas.createRoadmapSchema)
    .handler(async ({ data }): Promise<LearningRoadmapData> => {
        const supabase = getSupabaseServerClient();

        const { data: roadmap, error } = await supabase
            .from('learning_roadmaps')
            .insert({
                user_id: data.user_id,
                name: data.name,
                description: data.description,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating roadmap:', error);
            throw new Error('Failed to create roadmap');
        }

        return roadmap;
    });

export const updateRoadmap = createServerFn({ method: 'POST' })
    .inputValidator(LearningRoadmap._schemas.updateRoadmapSchema)
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_roadmaps')
            .update({
                name: data.name,
                description: data.description,
                updated_at: new Date().toISOString(),
            })
            .eq('id', data.id);

        if (error) {
            console.error('Error updating roadmap:', error);
            throw new Error('Failed to update roadmap');
        }
    });

export const deleteRoadmap = createServerFn({ method: 'POST' })
    .inputValidator(z.object({ id: z.coerce.number().int() }))
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_roadmaps')
            .delete()
            .eq('id', data.id);

        if (error) {
            console.error('Error deleting roadmap:', error);
            throw new Error('Failed to delete roadmap');
        }
    });

// ============================================
// Phase Server Functions
// ============================================

export const createPhase = createServerFn({ method: 'POST' })
    .inputValidator(LearningPhase._schemas.createPhaseSchema)
    .handler(async ({ data }): Promise<LearningPhaseData> => {
        const supabase = getSupabaseServerClient();

        const { data: phase, error } = await supabase
            .from('learning_phases')
            .insert({
                roadmap_id: data.roadmap_id,
                name: data.name,
                order_index: data.order_index,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating phase:', error);
            throw new Error('Failed to create phase');
        }

        return phase;
    });

export const updatePhase = createServerFn({ method: 'POST' })
    .inputValidator(LearningPhase._schemas.updatePhaseSchema)
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_phases')
            .update({
                name: data.name,
                order_index: data.order_index,
            })
            .eq('id', data.id);

        if (error) {
            console.error('Error updating phase:', error);
            throw new Error('Failed to update phase');
        }
    });

export const deletePhase = createServerFn({ method: 'POST' })
    .inputValidator(z.object({ id: z.coerce.number().int() }))
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_phases')
            .delete()
            .eq('id', data.id);

        if (error) {
            console.error('Error deleting phase:', error);
            throw new Error('Failed to delete phase');
        }
    });

// ============================================
// Item Server Functions
// ============================================

export const createItem = createServerFn({ method: 'POST' })
    .inputValidator(LearningItem._schemas.createItemSchema)
    .handler(async ({ data }): Promise<LearningItemData> => {
        const supabase = getSupabaseServerClient();

        const { data: item, error } = await supabase
            .from('learning_items')
            .insert({
                phase_id: data.phase_id,
                name: data.name,
                status: data.status,
                order_index: data.order_index,
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating item:', error);
            throw new Error('Failed to create item');
        }

        return item;
    });

export const updateItem = createServerFn({ method: 'POST' })
    .inputValidator(LearningItem._schemas.updateItemSchema)
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_items')
            .update({
                name: data.name,
                status: data.status,
                order_index: data.order_index,
            })
            .eq('id', data.id);

        if (error) {
            console.error('Error updating item:', error);
            throw new Error('Failed to update item');
        }
    });

export const deleteItem = createServerFn({ method: 'POST' })
    .inputValidator(z.object({ id: z.coerce.number().int() }))
    .handler(async ({ data }): Promise<void> => {
        const supabase = getSupabaseServerClient();

        const { error } = await supabase
            .from('learning_items')
            .delete()
            .eq('id', data.id);

        if (error) {
            console.error('Error deleting item:', error);
            throw new Error('Failed to delete item');
        }
    });
