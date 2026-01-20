import z from "zod";

type ConversationMessageData = z.infer<typeof ConversationMessage._schemas.plainMessageSchema>;

export class ConversationMessage {

    static readonly _schemas = {
        createMessageSchema: z.object({
            id: z.string().uuid(),
            conversationId: z.string().uuid(),
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string().min(1),
            metadata: z.object({}).passthrough(),
            tokenCount: z.number().min(0),
        }),

        updateMessageSchema: z.object({
            conversationId: z.string().uuid().optional(),
            role: z.enum(['user', 'assistant', 'system']).optional(),
            content: z.string().min(1).optional(),
            metadata: z.object({}).passthrough().optional(),
            tokenCount: z.number().min(0).optional(),
        }),

        plainMessageSchema: z.object({
            id: z.string().uuid(),
            conversationId: z.string().uuid(),
            role: z.enum(['user', 'assistant', 'system']),
            content: z.string().min(1),
            metadata: z.object({}).passthrough(),
            tokenCount: z.number().min(0),
            createdAt: z.string().datetime(),
        }),
    };

    constructor(
        private id: string,
        private conversationId: string,
        private role: 'user' | 'assistant' | 'system',
        private content: string,
        private metadata: Record<string, any> = {},
        private tokenCount: number,
        private createdAt: Date,
    ) { }

    getId() {
        return this.id;
    }

    getConversationId() {
        return this.conversationId;
    }

    getRole() {
        return this.role;
    }

    getContent() {
        return this.content;
    }

    getMetadata() {
        return this.metadata;
    }

    getTokenCount() {
        return this.tokenCount;
    }

    getCreatedAt() {
        return this.createdAt;
    }

    static fromJSONData(data: ConversationMessageData): ConversationMessage {
        return new ConversationMessage(
            data.id,
            data.conversationId,
            data.role,
            data.content,
            data.metadata,
            data.tokenCount,
            new Date(data.createdAt),
        );
    }
}