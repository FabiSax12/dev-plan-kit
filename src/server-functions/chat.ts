import { AIConversation } from "@/domain/AIConversation";
import { ConversationMessage } from "@/domain/ConversationMessage";
import { getSupabaseServerClient } from "@/lib/supabase.server";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

export const getConversations = createServerFn({
    method: "GET",
}).handler(async () => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('conversations').select('*');

    if (response.error) {
        throw new Error(response.error.message);
    }

    return response.data || [];
});

export const createConversation = createServerFn({
    method: "POST",
}).inputValidator(AIConversation._schemas.createConversationSchema)
    .handler(async () => {
        const supabase = getSupabaseServerClient();

        const response = await supabase.from('conversations').insert([{}]);

        if (response.error) {
            throw new Error(response.error.message);
        }
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
).handler(async () => {
    const supabase = getSupabaseServerClient();

    const response = await supabase.from('messages').insert([{}]);

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