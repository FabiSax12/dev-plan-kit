import { AIConversation, AIConversationData } from "@/domain/AIConversation";
import { ConversationMessage } from "@/domain/ConversationMessage";
import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getConversations = createServerFn({
    method: "GET",
}).handler(async (): Promise<AIConversationData[]> => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('conversations').select('*');

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data || [];
});

export const getConversationsByProject = createServerFn({
    method: "GET",
}).inputValidator(z.object({ projectId: z.number() }))
    .handler(async ({ data }): Promise<AIConversationData[]> => {
        const supabase = getSupabaseServerClient();

        const response = await supabase.from('conversations').select('*').eq("project_id", data.projectId);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    });

export const getConversationsByIdea = createServerFn({
    method: "GET",
}).inputValidator(z.object({ ideaId: z.number() }))
    .handler(async ({ data }): Promise<AIConversationData[]> => {
        const supabase = getSupabaseServerClient();

        const response = await supabase.from('conversations').select('*').eq("idea_id", data.ideaId);

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data || [];
    });

export const getConversationById = createServerFn({
    method: "POST",
}).inputValidator(z.object({ conversationId: z.number() }))
    .handler(async ({ data }): Promise<AIConversationData> => {
        const supabase = getSupabaseServerClient();

        const response = await supabase.from('conversations').select('*').eq('id', data.conversationId).single();

        if (response.error) {
            throw new Error(response.error.message);
        }

        return response.data as AIConversationData;
    });

export const createConversation = createServerFn({
    method: "POST",
}).inputValidator(AIConversation._schemas.createConversationSchema)
    .handler(async ({ data }) => {
        const supabase = getSupabaseServerClient();

        const response = await supabase.from('conversations').insert({
            title: data.title,
            user_id: data.userId,
            project_id: data.project_id,
            idea_id: data.idea_id,
            metadata: data.metadata,
        }).select("id").single();

        if (response.error) {
            throw new Error(response.error.message);
        }

        if (data.initial_messages && data.initial_messages.length > 0) {
            const conversationId = response.data.id;

            const messagesToInsert = data.initial_messages.map((msg) => ({
                conversation_id: conversationId,
                role: msg.role,
                content: msg.content,
                metadata: msg.metadata,
                token_count: msg.tokenCount,
            }));
            const messagesResponse = await supabase.from('messages').insert(messagesToInsert);

            if (messagesResponse.error) {
                throw new Error(messagesResponse.error.message);
            }

        }

        return response.data;
    });

export const deleteConversation = createServerFn({
    method: "POST",
}).inputValidator(
    z.object({ conversationId: z.number() })
).handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('conversations').delete().eq('id', data.conversationId);

    if (response.error) {
        throw new Error(response.error.message);
    }
});

export const getConversationMessages = createServerFn({
    method: "POST",
}).inputValidator(
    z.object({ conversationId: z.number() })
).handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('messages')
        .select('*')
        .eq('conversation_id', data.conversationId)
        .order('created_at', { ascending: true });

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data || [];
});

export const createConversationMessage = createServerFn({
    method: "POST",
}).inputValidator(
    ConversationMessage._schemas.createMessageSchema
).handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('messages').insert({
        conversation_id: data.conversationId,
        role: data.role,
        content: data.content,
        metadata: data.metadata,
        token_count: data.tokenCount,
    });

    if (response.error) {
        throw new Error(response.error.message);
    }
});

export const deleteConversationMessage = createServerFn({
    method: "POST",
}).inputValidator(
    z.object({ messageId: z.string().uuid() })
).handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('messages').delete().eq('id', data.messageId);

    if (response.error) {
        throw new Error(response.error.message);
    }
});